
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface ProfileStatsData {
  connections: number;
  followers: number;
  following: number;
}

export function useProfileStats(profileId: string, currentUser: User | null): ProfileStatsData {
  const [connections, setConnections] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // For now, we'll show real counts based on localStorage if available
        if (currentUser) {
          // Get following count
          const followingData = localStorage.getItem(`following_${profileId}`);
          if (followingData) {
            try {
              const followingList = JSON.parse(followingData);
              if (Array.isArray(followingList)) {
                setFollowing(followingList.length);
              } else {
                setFollowing(0);
              }
            } catch (e) {
              setFollowing(0);
            }
          } else {
            setFollowing(0);
          }
          
          // Get followers (people following this profile)
          let followersCount = 0;
          if (profileId) {
            const allUserIds = [];
            // This is just a demo implementation - in a real app, we would query the database
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('following_')) {
                allUserIds.push(key.replace('following_', ''));
              }
            }
            
            // Check each user's following list
            for (const userId of allUserIds) {
              const userData = localStorage.getItem(`following_${userId}`);
              if (userData) {
                try {
                  const userFollowing = JSON.parse(userData);
                  if (Array.isArray(userFollowing) && userFollowing.includes(profileId)) {
                    followersCount++;
                  }
                } catch (e) {
                  // Skip this user if data is invalid
                }
              }
            }
          }
          setFollowers(followersCount);
          
          // Get connections (just a placeholder for now)
          // For now using 0 for connections since we don't have a clear "connections" implementation
          setConnections(0);
        } else {
          // Set zeros when not logged in
          setConnections(0);
          setFollowers(0);
          setFollowing(0);
        }
        
        // In a real implementation, you would fetch the actual counts:
        // const { count: followersCount } = await supabase
        //   .from('followers')
        //   .select('*', { count: 'exact', head: true })
        //   .eq('followed_id', profileId);
        // setFollowers(followersCount || 0);
        
        // ... similarly for connections and following
      } catch (error) {
        console.error("Error fetching counts:", error);
        // Reset to zero on error
        setConnections(0);
        setFollowers(0);
        setFollowing(0);
      }
    };
    
    fetchCounts();
  }, [profileId, currentUser]);

  return {
    connections,
    followers,
    following
  };
}
