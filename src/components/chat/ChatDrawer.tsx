import { useState, useEffect } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export function ChatDrawer({ isOpen, onClose, userId }: ChatDrawerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    if (isOpen && userId) {
      loadConversations();
    }
  }, [isOpen, userId]);
  
  const loadConversations = async () => {
    setIsLoading(true);
    
    try {
      // This is a demo implementation using localStorage
      // In a real app, you would fetch this from your API
      const storedConversations: Conversation[] = [];
      
      // Get all users from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .not("id", "eq", userId);
      
      if (error) throw error;
      
      // For each profile, check if we have a chat history with them
      if (data) {
        data.forEach(profile => {
          const storageKey = `chat_history_${userId}_${profile.id}`;
          const chatHistory = localStorage.getItem(storageKey);
          
          if (chatHistory) {
            try {
              const messages = JSON.parse(chatHistory);
              if (messages.length > 0) {
                // Get the last message
                const lastMsg = messages[messages.length - 1];
                
                storedConversations.push({
                  id: `conv_${profile.id}`,
                  recipientId: profile.id,
                  recipientName: profile.name,
                  recipientAvatar: profile.avatar_url,
                  lastMessage: lastMsg.content.length > 30 ? 
                    `${lastMsg.content.substring(0, 30)}...` : 
                    lastMsg.content,
                  timestamp: lastMsg.timestamp,
                  unread: Math.random() > 0.7 // Simulate some unread messages
                });
              }
            } catch (err) {
              console.error("Error parsing chat history:", err);
            }
          }
        });
        
        // Sort conversations by timestamp (newest first)
        storedConversations.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setConversations(storedConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMessages = (recipientId: string) => {
    const storageKey = `chat_history_${userId}_${recipientId}`;
    const chatHistory = localStorage.getItem(storageKey);
    
    if (chatHistory) {
      try {
        const parsedMessages = JSON.parse(chatHistory);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          isFromCurrentUser: msg.senderId === userId
        })));
      } catch (err) {
        console.error("Error parsing chat history:", err);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;
    
    try {
      const recipientId = activeChat;
      
      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: userId,
        recipientId: recipientId,
        content: message,
        timestamp: new Date().toISOString(),
        isFromCurrentUser: true
      };
      
      // Add message to the current state
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Store in localStorage
      const storageKey = `chat_history_${userId}_${recipientId}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
      
      // Update conversation list
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.recipientId === recipientId);
        
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            lastMessage: message.length > 30 ? `${message.substring(0, 30)}...` : message,
            timestamp: new Date().toISOString(),
            unread: false
          };
          
          // Sort by newest
          updated.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        }
        
        return updated;
      });
      
      // Clear input
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleSelectChat = (recipientId: string) => {
    setActiveChat(recipientId);
    loadMessages(recipientId);
    
    // Mark as read
    setConversations(prev => 
      prev.map(c => c.recipientId === recipientId ? {...c, unread: false} : c)
    );
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  const formatConversationTime = (timestamp: string) => {
    const msgDate = new Date(timestamp);
    const today = new Date();
    
    // If message is from today, show time only
    if (msgDate.toDateString() === today.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return msgDate.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };
  
  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeConversation = conversations.find(c => c.recipientId === activeChat);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] max-h-[85vh] rounded-t-xl">
        <div className="h-full flex flex-col">
          <DrawerHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-semibold">Mensagens</DrawerTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mensagens..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DrawerHeader>
          
          <div className="flex flex-1 overflow-hidden">
            <div className={`w-full sm:w-1/3 border-r ${activeChat ? 'hidden sm:block' : 'block'}`}>
              <ScrollArea className="h-[calc(85vh-130px)]">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse">Carregando conversas...</div>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                        activeChat === conversation.recipientId ? 'bg-blue-50' : ''
                      } ${conversation.unread ? 'bg-blue-50/50' : ''}`}
                      onClick={() => handleSelectChat(conversation.recipientId)}
                    >
                      <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                        {conversation.recipientAvatar ? (
                          <img 
                            src={conversation.recipientAvatar}
                            alt={conversation.recipientName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
                            {conversation.recipientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className={`font-medium truncate ${conversation.unread ? 'font-semibold' : ''}`}>
                            {conversation.recipientName}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatConversationTime(conversation.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conversation.unread ? 'text-black font-medium' : 'text-gray-500'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-1 flex-shrink-0"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center gap-4">
                    <MessageCircle className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">
                      {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm text-gray-400">
                        Visite os perfis dos profissionais para iniciar uma conversa
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className={`w-full sm:w-2/3 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
              {activeChat ? (
                <>
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="sm:hidden mr-2" onClick={() => setActiveChat(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Avatar className="h-8 w-8 mr-2">
                        {activeConversation?.recipientAvatar ? (
                          <img 
                            src={activeConversation.recipientAvatar}
                            alt={activeConversation.recipientName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm font-medium">
                            {activeConversation?.recipientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <span className="font-medium">{activeConversation?.recipientName}</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4 bg-gray-50">
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {!msg.isFromCurrentUser && (
                              <Avatar className="h-6 w-6 mr-2 mt-1 flex-shrink-0">
                                {activeConversation?.recipientAvatar ? (
                                  <img 
                                    src={activeConversation.recipientAvatar}
                                    alt={activeConversation.recipientName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs font-medium">
                                    {activeConversation?.recipientName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </Avatar>
                            )}
                            <div 
                              className={`max-w-[75%] px-3 py-2 rounded-lg ${
                                msg.isFromCurrentUser 
                                  ? 'bg-blue-600 text-white rounded-br-none' 
                                  : 'bg-white border border-gray-200 rounded-bl-none'
                              }`}
                            >
                              <p className="break-words text-sm">{msg.content}</p>
                              <span className={`text-xs block mt-1 ${msg.isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatMessageTime(msg.timestamp)}
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
                  </ScrollArea>
                  
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <Input
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
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Suas mensagens</h3>
                    <p className="text-gray-500 max-w-xs">
                      Selecione uma conversa ou inicie uma nova a partir de um perfil profissional
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
