
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Conversation } from "@/components/messages/types";
import { ConnectionUser, fetchConnectionUserIds, fetchUserProfiles } from "@/utils/connectionUtils";

export function useMessages(userId: string | undefined) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectionUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    recipientId: string;
    recipientName: string;
    isOpen: boolean;
  } | null>(null);

  useEffect(() => {
    if (userId) {
      loadConversations();
      loadConnectedUsers();
    } else {
      navigate("/login");
    }
  }, [userId, navigate]);

  const loadConnectedUsers = async () => {
    if (!userId) return;
    
    try {
      const connectionIds = await fetchConnectionUserIds(userId, "connections");
      
      if (connectionIds.length > 0) {
        const profiles = await fetchUserProfiles(connectionIds);
        
        // Filter out users that already have conversations
        const filteredProfiles = profiles.filter(profile => 
          !conversations.some(conv => conv.recipientId === profile.id)
        );
        
        setConnectedUsers(filteredProfiles);
      }
    } catch (error) {
      console.error("Error loading connected users:", error);
    }
  };

  const loadConversations = async () => {
    setIsLoading(true);
    
    const storedConversations: Conversation[] = [];
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .not("id", "eq", userId);
      
      if (error) {
        console.error("Error fetching profiles:", error);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        data.forEach(profile => {
          const storageKey = `chat_history_${userId}_${profile.id}`;
          const chatHistory = localStorage.getItem(storageKey);
          
          if (chatHistory) {
            try {
              const messages = JSON.parse(chatHistory);
              if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                
                storedConversations.push({
                  id: `conv_${profile.id}`,
                  recipientId: profile.id,
                  recipientName: profile.name,
                  recipientAvatar: profile.avatar_url,
                  lastMessage: lastMsg.content.length > 30 ? 
                    `${lastMsg.content.substring(0, 30)}...` : 
                    lastMsg.content,
                  timestamp: lastMsg.timestamp
                });
              }
            } catch (err) {
              console.error("Error parsing chat history:", err);
            }
          }
        });
        
        storedConversations.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setConversations(storedConversations);
        
        // After setting conversations, load connected users to filter them properly
        if (userId) {
          loadConnectedUsers();
        }
      }
    } catch (error) {
      console.error("Error in loadConversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = (recipientId: string, recipientName: string) => {
    setSelectedChat({
      recipientId,
      recipientName,
      isOpen: true
    });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    loadConversations();
    loadConnectedUsers();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
    conversations,
    connectedUsers,
    searchTerm,
    isLoading,
    selectedChat,
    handleOpenChat,
    handleCloseChat,
    handleSearchChange
  };
}
