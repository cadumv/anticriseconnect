
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

interface UseFollowStatusReturn {
  isFollowing: boolean;
  followLoading: boolean;
  handleFollowToggle: () => Promise<void>;
}

export const useFollowStatus = (profileId: string | undefined, user: User | null): UseFollowStatusReturn => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && profileId && profileId !== ":id") {
        try {
          const followData = localStorage.getItem(`following_${user.id}`);
          if (followData) {
            const followingList = JSON.parse(followData);
            setIsFollowing(followingList.includes(profileId));
          }
        } catch (err) {
          console.error("Erro ao verificar status de seguidor:", err);
        }
      }
    };

    checkFollowStatus();
  }, [profileId, user]);

  const handleFollowToggle = async () => {
    if (!user || !profileId) return;
    
    try {
      setFollowLoading(true);
      
      let followingList: string[] = [];
      const followData = localStorage.getItem(`following_${user.id}`);
      
      if (followData) {
        followingList = JSON.parse(followData);
      }
      
      if (isFollowing) {
        followingList = followingList.filter(id => id !== profileId);
      } else {
        if (!followingList.includes(profileId)) {
          followingList.push(profileId);
        }
      }
      
      localStorage.setItem(`following_${user.id}`, JSON.stringify(followingList));
      setIsFollowing(!isFollowing);
      
    } catch (err: any) {
      console.error("Erro ao seguir/deixar de seguir:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  return { isFollowing, followLoading, handleFollowToggle };
};
