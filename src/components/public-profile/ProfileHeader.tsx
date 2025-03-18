
import { User as AuthUser } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { supabase } from "@/lib/supabase";

interface ProfileData {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  avatar_url: string | null;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  currentUser: AuthUser | null;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileHeader = ({
  profile,
  currentUser,
  isFollowing,
  followLoading,
  onFollowToggle,
  onConnectionRequest,
}: ProfileHeaderProps) => {
  // State for tracking actual counts
  const [connections, setConnections] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  
  // Fetch actual counts when component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // For now, we'll show real counts based on localStorage if available
        if (currentUser) {
          // Get following count
          const followingData = localStorage.getItem(`following_${profile.id}`);
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
          if (profile.id) {
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
                  if (Array.isArray(userFollowing) && userFollowing.includes(profile.id)) {
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
        //   .eq('followed_id', profile.id);
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
  }, [profile.id, currentUser, isFollowing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar 
            avatarUrl={profile.avatar_url} 
            name={profile.name} 
          />
          <ProfileInfo 
            name={profile.name}
            username={profile.username}
            engineeringType={profile.engineering_type}
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <ProfileStats 
            connections={connections}
            followers={followers}
            following={following}
          />

          <ProfileActions 
            profileId={profile.id}
            currentUser={currentUser}
            isFollowing={isFollowing}
            followLoading={followLoading}
            onFollowToggle={onFollowToggle}
            onConnectionRequest={onConnectionRequest}
          />
        </div>
      </div>
    </div>
  );
};
