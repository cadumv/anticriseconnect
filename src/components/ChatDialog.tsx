
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

  // Load chat history when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user, recipientId]);

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

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Conversa com {recipientName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 px-1 min-h-[300px] max-h-[400px]">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.isFromCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Nenhuma mensagem ainda. Inicie uma conversa!
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-end gap-2 pt-4 border-t">
          <Textarea
            className="min-h-[80px]"
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
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
