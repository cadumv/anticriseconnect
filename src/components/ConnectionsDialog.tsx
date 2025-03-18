
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Handshake, Users, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ConnectionType = "connections" | "followers" | "following";

interface ConnectionsDialogProps {
  type: ConnectionType;
  count: number;
}

interface ConnectionUser {
  id: string;
  name: string;
  avatar_url: string | null;
  engineering_type: string | null;
}

export const ConnectionsDialog = ({ type, count }: ConnectionsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const getTitle = () => {
    switch (type) {
      case "connections": return "Conexões";
      case "followers": return "Seguidores";
      case "following": return "Seguindo";
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case "connections": return <Handshake className="h-4 w-4 text-blue-500" />;
      case "followers": return <Users className="h-4 w-4 text-blue-500" />;
      case "following": return <UserPlus className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const loadUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let userIds: string[] = [];
      
      // Get the right set of users based on the connection type
      if (type === "following") {
        // Get users the current user is following
        const followingData = localStorage.getItem(`following_${user.id}`);
        if (followingData) {
          userIds = JSON.parse(followingData);
        }
      } else if (type === "followers") {
        // Find users who follow the current user
        const allUsers = await supabase.from('profiles').select('id').not('id', 'eq', user.id);
        if (allUsers.data) {
          for (const potentialFollower of allUsers.data) {
            const followingData = localStorage.getItem(`following_${potentialFollower.id}`);
            if (followingData) {
              const followingList = JSON.parse(followingData);
              if (Array.isArray(followingList) && followingList.includes(user.id)) {
                userIds.push(potentialFollower.id);
              }
            }
          }
        }
      } else if (type === "connections") {
        // Find mutual connections (accepted requests)
        const userConnectionKey = `connection_requests_${user.id}`;
        const userRequests = localStorage.getItem(userConnectionKey);
        
        if (userRequests) {
          const parsedUserRequests = JSON.parse(userRequests);
          // Get IDs of users with accepted connection requests
          for (const request of parsedUserRequests) {
            if (request.status === 'accepted') {
              userIds.push(request.targetId);
            }
          }
        }
        
        // Also check for requests made to the current user that were accepted
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
              
              if (acceptedRequest && !userIds.includes(otherUser.id)) {
                userIds.push(otherUser.id);
              }
            }
          }
        }
      }
      
      // If we have user IDs, fetch their profile data
      if (userIds.length > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, engineering_type')
          .in('id', userIds);
        
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        setUsers(data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open, type, user]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-1">
            {getIcon()}
            <span className="font-bold text-base">{count}</span>
          </div>
          <span className="text-gray-700 font-medium">{getTitle().toLowerCase()}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()} {getTitle()} ({count})
          </DialogTitle>
          <DialogDescription>
            {type === "connections" && "Pessoas que se conectaram com você para trocas anticrise."}
            {type === "followers" && "Pessoas que seguem seu perfil."}
            {type === "following" && "Perfis que você segue."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse text-gray-500">Carregando...</div>
            </div>
          ) : users.length > 0 ? (
            users.map(user => (
              <Link 
                key={user.id} 
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md block"
              >
                <Avatar className="w-10 h-10">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-500">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.engineering_type || "Engenheiro(a)"}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500">
              {type === "connections" && "Nenhuma conexão encontrada."}
              {type === "followers" && "Nenhum seguidor encontrado."}
              {type === "following" && "Não está seguindo ninguém."}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
