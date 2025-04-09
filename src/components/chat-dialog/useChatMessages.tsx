
import { useState, useEffect } from "react";
import { Message } from "./types";
import { useAuth } from "@/hooks/useAuth";

export function useChatMessages(recipientId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && recipientId) {
      loadChatHistory();
      loadChatRating();
    }
  }, [user, recipientId]);

  const loadChatHistory = () => {
    if (!user) return;
    
    // For demonstration purposes, we'll use localStorage to store messages
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

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !user) return;
    
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: user.id,
        recipientId: recipientId,
        content: content,
        timestamp: new Date().toISOString(),
        isFromCurrentUser: true
      };
      
      // Add message to the current state
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Store in localStorage for demonstration
      const storageKey = `chat_history_${user.id}_${recipientId}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return {
    messages,
    rating, 
    handleSendMessage
  };
}
