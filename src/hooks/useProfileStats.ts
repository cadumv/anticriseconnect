
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { fetchConnectionUserIds } from "@/utils/connections";

interface ProfileStatsData {
  connections: number;
  followers: number;
  following: number;
}

export function useProfileStats(profileId: string, currentUser: User | null): ProfileStatsData {
  const [stats, setStats] = useState<ProfileStatsData>({
    connections: 0,
    followers: 0,
    following: 0
  });
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (!profileId) return;
        
        // Use our connection utilities to fetch all the relevant user IDs
        const connectionIds = await fetchConnectionUserIds(profileId, "connections");
        const followerIds = await fetchConnectionUserIds(profileId, "followers");
        const followingIds = await fetchConnectionUserIds(profileId, "following");
        
        setStats({
          connections: connectionIds.length,
          followers: followerIds.length,
          following: followingIds.length
        });
      } catch (error) {
        console.error("Error fetching profile stats:", error);
        // Reset to zero on error
        setStats({
          connections: 0,
          followers: 0,
          following: 0
        });
      }
    };
    
    fetchCounts();
  }, [profileId, currentUser]);

  return stats;
}
