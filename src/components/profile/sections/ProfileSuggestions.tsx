
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlusCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SuggestedUser {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

export const ProfileSuggestions = () => {
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

  const renderUserCard = (user: SuggestedUser, type: 'follow' | 'connect' = 'follow') => {
    const isFollowed = following[user.id] || false;
    const isConnected = connected[user.id] || false;
    const actionState = type === 'follow' ? isFollowed : isConnected;
    const handleAction = type === 'follow' ? handleFollow : handleConnect;

    return (
      <div key={user.id} className="flex items-start gap-3 py-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.title}</p>
          {user.subtitle && <p className="text-xs text-gray-500 truncate">{user.subtitle}</p>}
          <div className="mt-1">
            {type === 'follow' ? (
              <Button 
                variant={isFollowed ? "outline" : "outline"} 
                size="sm" 
                className={`w-full text-xs ${isFollowed ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => handleAction(user.id)}
              >
                {isFollowed ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Seguindo</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Seguir</span>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => handleAction(user.id)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span>Conectar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-lg font-semibold">Mais perfis para você</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {suggestedUsers.length > 0 ? (
            <div className="divide-y">
              {suggestedUsers.map(user => renderUserCard(user))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma sugestão disponível no momento.</p>
          )}
          <div className="w-full mt-2">
            <Link to="/search" className="w-full">
              <Button 
                variant="link" 
                className="w-full text-blue-600" 
                size="sm"
              >
                Exibir tudo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-lg font-semibold">Pessoas que talvez você conheça</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {connectionSuggestions.length > 0 ? (
            <div className="divide-y">
              {connectionSuggestions.map(user => renderUserCard(user, 'connect'))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma sugestão disponível no momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
