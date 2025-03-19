
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SuggestedUser {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

export const useSuggestions = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [connectionSuggestions, setConnectionSuggestions] = useState<SuggestedUser[]>([]);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, engineering_type, professional_description, avatar_url')
        .not('name', 'is', null)
        .limit(5);

      if (error) throw error;

      console.log('Suggested users fetched:', data);

      if (data) {
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.name,
          title: user.engineering_type || "Engenheiro(a)",
          subtitle: user.professional_description?.substring(0, 60) || undefined,
          avatarUrl: user.avatar_url || undefined,
          isFollowing: false // Will be updated in checkFollowingStatus
        }));

        setSuggestedUsers(formattedUsers);
        
        // Initialize following state
        const initialFollowingState: Record<string, boolean> = {};
        formattedUsers.forEach(user => {
          initialFollowingState[user.id] = false;
        });
        
        setFollowing(initialFollowingState);
        
        // Also set a small subset for connection suggestions
        if (formattedUsers.length > 0) {
          setConnectionSuggestions(formattedUsers.slice(0, 2));
        }
        
        // Then check following status
        await checkFollowingStatus(formattedUsers);
      }
    } catch (err) {
      console.error("Error fetching user suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowingStatus = async (users: SuggestedUser[]) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;
      
      const userId = data.user.id;
      const followingData = localStorage.getItem(`following_${userId}`);
      
      if (followingData) {
        try {
          const followingList = JSON.parse(followingData);
          
          if (Array.isArray(followingList)) {
            const newFollowingState = { ...following };
            
            users.forEach(user => {
              newFollowingState[user.id] = followingList.includes(user.id);
            });
            
            setFollowing(newFollowingState);
          }
        } catch (error) {
          console.error("Error parsing following data:", error);
        }
      }
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;
      
      const currentUserId = data.user.id;
      let followingList: string[] = [];
      
      const followData = localStorage.getItem(`following_${currentUserId}`);
      if (followData) {
        try {
          followingList = JSON.parse(followData);
        } catch (err) {
          console.error("Error parsing following data:", err);
        }
      }
      
      if (!Array.isArray(followingList)) {
        followingList = [];
      }
      
      // Toggle following
      if (following[userId]) {
        // Unfollow
        followingList = followingList.filter(id => id !== userId);
      } else {
        // Follow
        if (!followingList.includes(userId)) {
          followingList.push(userId);
        }
      }
      
      // Save to localStorage
      localStorage.setItem(`following_${currentUserId}`, JSON.stringify(followingList));
      
      // Update state
      setFollowing(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleConnect = (userId: string) => {
    setConnected(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return {
    suggestedUsers,
    connectionSuggestions,
    following,
    connected,
    loading,
    handleFollow,
    handleConnect
  };
};
