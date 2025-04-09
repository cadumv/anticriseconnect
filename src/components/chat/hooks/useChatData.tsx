
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

export function useChatData(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);
  
  const loadConversations = async () => {
    setIsLoading(true);
    
    try {
      // This is a demo implementation using localStorage
      const storedConversations: Conversation[] = [];
      
      // Get all users from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .not("id", "eq", userId);
      
      if (error) throw error;
      
      // For each profile, check if we have a chat history
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
                
                const lastMessageText = lastMsg.imageUrl 
                  ? (lastMsg.content ? `${lastMsg.content} [Imagem]` : "[Imagem]") 
                  : lastMsg.content;
                
                storedConversations.push({
                  id: `conv_${profile.id}`,
                  recipientId: profile.id,
                  recipientName: profile.name,
                  recipientAvatar: profile.avatar_url,
                  lastMessage: lastMessageText.length > 30 ? 
                    `${lastMessageText.substring(0, 30)}...` : 
                    lastMessageText,
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
  
  const handleSendMessage = (message: string, imageUrl?: string) => {
    if ((!message.trim() && !imageUrl) || !activeChat) return;
    
    try {
      const recipientId = activeChat;
      
      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: userId,
        recipientId: recipientId,
        content: message,
        imageUrl: imageUrl,
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
        
        const lastMessageText = imageUrl 
          ? (message ? `${message} [Imagem]` : "[Imagem]") 
          : message;
        
        if (index >= 0) {
          updated[index] = {
            ...updated[index],
            lastMessage: lastMessageText.length > 30 ? 
              `${lastMessageText.substring(0, 30)}...` : 
              lastMessageText,
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

  return {
    conversations,
    messages,
    searchTerm,
    isLoading,
    activeChat,
    setSearchTerm,
    handleSelectChat,
    handleSendMessage,
    setActiveChat,
    activeConversation: conversations.find(c => c.recipientId === activeChat)
  };
}
