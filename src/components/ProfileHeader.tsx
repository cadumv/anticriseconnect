
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileHeaderAvatar } from "./profile/ProfileHeaderAvatar";
import { ProfileHeaderInfo } from "./profile/ProfileHeaderInfo";
import { ProfileHeaderStats } from "./profile/ProfileHeaderStats";

export const ProfileHeader = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    const countConnections = async () => {
      try {
        // Count connections from user's outgoing requests
        let connectionCount = 0;
        const userConnectionKey = `connection_requests_${user.id}`;
        const userRequests = localStorage.getItem(userConnectionKey);
        
        if (userRequests) {
          const parsedUserRequests = JSON.parse(userRequests);
          // Count accepted connections
          connectionCount += parsedUserRequests.filter((req: any) => req.status === 'accepted').length;
        }
        
        // Also count incoming accepted requests
        const allProfiles = await supabase.from('profiles').select('id');
        if (allProfiles.data) {
          for (const otherUser of allProfiles.data) {
            if (otherUser.id === user.id) continue;
            
            const connectionKey = `connection_requests_${otherUser.id}`;
            const existingRequests = localStorage.getItem(connectionKey);
            
            if (existingRequests) {
              const requests = JSON.parse(existingRequests);
              const acceptedRequest = requests.find((req: any) => 
                req.targetId === user.id && req.status === 'accepted'
              );
              
              if (acceptedRequest) {
                connectionCount++;
              }
            }
          }
        }
        
        setConnections(connectionCount);
      } catch (error) {
        console.error('Error counting connections:', error);
      }
    };
    
    const countFollowers = async () => {
      try {
        let followerCount = 0;
        // Check each user's following list to see if they follow the current user
        const allProfiles = await supabase.from('profiles').select('id');
        if (allProfiles.data) {
          for (const potentialFollower of allProfiles.data) {
            if (potentialFollower.id === user.id) continue;
            
            const followingData = localStorage.getItem(`following_${potentialFollower.id}`);
            if (followingData) {
              const followingList = JSON.parse(followingData);
              if (Array.isArray(followingList) && followingList.includes(user.id)) {
                followerCount++;
              }
            }
          }
        }
        
        setFollowers(followerCount);
      } catch (error) {
        console.error('Error counting followers:', error);
      }
    };
    
    const countFollowing = () => {
      try {
        // Get users the current user is following
        const followingData = localStorage.getItem(`following_${user.id}`);
        if (followingData) {
          const followingList = JSON.parse(followingData);
          setFollowing(Array.isArray(followingList) ? followingList.length : 0);
        } else {
          setFollowing(0);
        }
      } catch (error) {
        console.error('Error counting following:', error);
      }
    };
    
    countConnections();
    countFollowers();
    countFollowing();
  }, [user]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ProfileHeaderAvatar user={user} />
        
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <ProfileHeaderInfo user={user} />
            <ProfileHeaderStats 
              connections={connections}
              followers={followers}
              following={following}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
