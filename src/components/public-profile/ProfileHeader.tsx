
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, UserCheck, Handshake, Users, AtSign } from "lucide-react";
import { User as AuthUser } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
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
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={`Foto de ${profile.name}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-blue-500" />
            )}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            {profile.username && (
              <div className="flex items-center text-gray-600 mt-1">
                <AtSign className="h-4 w-4 mr-1" />
                <span>{profile.username}</span>
              </div>
            )}
            {profile.engineering_type && (
              <Badge className="mt-2">{profile.engineering_type}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          {/* Dynamic stats based on fetched data */}
          <div className="flex items-center gap-4 text-sm mr-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Handshake className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{connections}</span>
              </div>
              <span className="text-gray-700 font-medium">conexões</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{followers}</span>
              </div>
              <span className="text-gray-700 font-medium">seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-base">{following}</span>
              </div>
              <span className="text-gray-700 font-medium">seguindo</span>
            </div>
          </div>

          {currentUser && currentUser.id !== profile.id && (
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={isFollowing ? "outline" : "default"} 
                onClick={onFollowToggle}
                disabled={followLoading}
                className="gap-1"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" /> Seguindo
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Seguir
                  </>
                )}
              </Button>
              <Button 
                onClick={onConnectionRequest}
                className="gap-1"
                variant="secondary"
              >
                <Handshake className="h-4 w-4" /> Conexão Anticrise
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
