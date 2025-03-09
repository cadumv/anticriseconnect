
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

export function ChatDialog({
  isOpen,
  onClose,
  recipientId,
  recipientName,
}: ChatDialogProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Load chat history when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
      loadChatRating();
    }
  }, [isOpen, user, recipientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = () => {
    if (!user) return;
    
    // For demonstration purposes, we'll use localStorage to store messages
    // In a real app, this would come from your backend/database
    const storageKey = `chat_history_${user.id}_${recipientId}`;
    const existingChat = localStorage.getItem(storageKey);
    
    if (existingChat) {
      try {
        const parsedMessages = JSON.parse(existingChat);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          isFromCurrentUser: msg.senderId === user.id
        })));
      } catch (err) {
        console.error("Error parsing chat history:", err);
      }
    }
  };

  const loadChatRating = () => {
    if (!user) return;
    
    const ratingKey = `chat_rating_${user.id}_${recipientId}`;
    const savedRating = localStorage.getItem(ratingKey);
    
    if (savedRating) {
      setRating(parseInt(savedRating, 10));
    }
  };

  const saveRating = (value: number) => {
    if (!user) return;
    
    const ratingKey = `chat_rating_${user.id}_${recipientId}`;
    localStorage.setItem(ratingKey, value.toString());
    setRating(value);
    
    // Show toast notification
    toast.success("Avaliação salva com sucesso!");
    
    // Check if this is the first rating (achievement trigger)
    const hasRatedBefore = localStorage.getItem('has_rated_conversation');
    if (!hasRatedBefore) {
      localStorage.setItem('has_rated_conversation', 'true');
      // In a real app, you would trigger the achievement on the backend
      toast.success("🏆 Conquista desbloqueada: Primeiro feedback!");
    }
  };

  const containsEmailOrPhone = (text: string) => {
    // Email regex pattern
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    // Phone regex patterns (Brazilian format and international formats)
    const phonePatterns = [
      /(\(?\d{2}\)?\s?)(\d{4,5}[-\s]?\d{4})/g, // Brazilian format
      /\+\d{1,3}\s?\(\d{1,3}\)\s?\d{3,4}[-\s]?\d{4}/g, // International format
      /\d{3}[-\s]?\d{3}[-\s]?\d{4}/g, // Simple format
    ];
    
    if (emailPattern.test(text)) {
      return true;
    }
    
    for (const pattern of phonePatterns) {
      if (pattern.test(text)) {
        return true;
      }
    }
    
    return false;
  };

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    // Check for email or phone number in the message
    if (containsEmailOrPhone(message)) {
      toast.error("Não é permitido enviar emails ou números de telefone nas mensagens. Esta funcionalidade está disponível apenas no plano premium.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: user.id,
        recipientId: recipientId,
        content: message,
        timestamp: new Date().toISOString(),
        isFromCurrentUser: true
      };
      
      // Add message to the current state
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Store in localStorage for demonstration
      // In a real app, you would send this to your backend/database
      const storageKey = `chat_history_${user.id}_${recipientId}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
      
      // Clear input
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="border-b p-4 flex flex-row items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-700 font-semibold">
                {recipientName.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <div className="flex flex-col">
              <DialogTitle className="text-lg">{recipientName}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px] max-h-[400px]">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isFromCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-700 font-semibold">
                        {recipientName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                  )}
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      msg.isFromCurrentUser 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <span className={`text-xs block mt-1 ${msg.isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatMessageDate(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Nenhuma mensagem ainda. Inicie uma conversa!
              </p>
            </div>
          )}
        </div>
        
        {/* Rating system */}
        {messages.length > 0 && (
          <div className="px-4 py-2 border-t bg-white">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-1">Avalie esta conversa:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => saveRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        (hoverRating !== null ? star <= hoverRating : star <= (rating || 0))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <Textarea
              className="min-h-[60px] resize-none"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={isSubmitting || !message.trim()}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            O envio de emails e números de telefone não é permitido.
            <br/>
            Disponível no plano premium.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
