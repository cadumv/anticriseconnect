
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ConnectionsDialog } from "./ConnectionsDialog";
import { Achievements } from "./Achievements"; // Import the Achievements component

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
        const allUsers = await supabase.from('profiles').select('id').not('id', 'eq', user.id);
        if (allUsers.data) {
          for (const otherUser of allUsers.data) {
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
        const allUsers = await supabase.from('profiles').select('id').not('id', 'eq', user.id);
        if (allUsers.data) {
          for (const potentialFollower of allUsers.data) {
            const followingData = localStorage.getItem(`following_${potentialFollower.id}`);
            if (followingData && JSON.parse(followingData).includes(user.id)) {
              followerCount++;
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
          setFollowing(followingList.length);
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
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-blue-500">
              {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              {user?.user_metadata?.engineering_type && (
                <Badge className="mb-2">{user.user_metadata.engineering_type}</Badge>
              )}
              <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h1>
            </div>
            
            <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0 mx-auto sm:mx-0">
              <ConnectionsDialog type="connections" count={connections} />
              <ConnectionsDialog type="followers" count={followers} />
              <ConnectionsDialog type="following" count={following} />
            </div>
          </div>
          
          {user?.user_metadata?.professional_description && (
            <p className="mt-2 text-sm text-gray-700">{user.user_metadata.professional_description}</p>
          )}
          
          {user?.user_metadata?.areas_of_expertise && user.user_metadata.areas_of_expertise.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Áreas de atuação:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                  area && <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          
          {user ? (
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Link to="/profile">
                <Button size="sm" variant="outline">Editar Perfil</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Link to="/login">
                <Button size="sm" variant="default">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Achievements component below the profile info */}
      <div className="mt-6">
        <Achievements 
          showProfileSpecific={true}
          profileId={user?.id}
          isDemoProfile={false}
          compact={true}
        />
      </div>
    </div>
  );
};
