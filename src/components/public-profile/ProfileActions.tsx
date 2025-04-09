
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Handshake, X, Clock } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ProfileActionsProps {
  profileId: string;
  currentUser: User | null;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionPending: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileActions = ({
  profileId,
  currentUser,
  isFollowing,
  followLoading,
  isConnectionPending,
  onFollowToggle,
  onConnectionRequest,
}: ProfileActionsProps) => {
  const [requestLoading, setRequestLoading] = useState(false);

  if (!currentUser || currentUser.id === profileId) {
    return null;
  }

  // Function to cancel a connection request
  const handleCancelRequest = () => {
    if (!currentUser) return;
    
    try {
      // Get existing connection requests
      const connectionKey = `connection_requests_${currentUser.id}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        // Filter out the request to this profile
        const updatedRequests = requests.filter((req: any) => req.targetId !== profileId);
        
        // Update localStorage
        localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
        
        // Try to find and remove notification from target user
        try {
          const targetNotificationsKey = `notifications_${profileId}`;
          const targetNotifications = localStorage.getItem(targetNotificationsKey);
          
          if (targetNotifications) {
            const parsedTargetNotifications = JSON.parse(targetNotifications);
            // Filter out notifications about this connection request
            const updatedTargetNotifications = parsedTargetNotifications.filter((notif: any) => 
              !(notif.senderId === currentUser.id && notif.type === "partnership")
            );
            
            localStorage.setItem(targetNotificationsKey, JSON.stringify(updatedTargetNotifications));
          }
        } catch (notifError) {
          console.error("Error removing notification from target:", notifError);
        }
        
        // Update own notifications to remove the connection request notification
        const ownNotificationsKey = `notifications_${currentUser.id}`;
        const ownNotifications = localStorage.getItem(ownNotificationsKey);
        
        if (ownNotifications) {
          const parsedOwnNotifications = JSON.parse(ownNotifications);
          const updatedOwnNotifications = parsedOwnNotifications.filter((notif: any) => 
            !(notif.link === `/profile/${profileId}` && notif.type === "partnership")
          );
          
          localStorage.setItem(ownNotificationsKey, JSON.stringify(updatedOwnNotifications));
        }
      }
      
      toast.success("Solicitação de conexão cancelada");
      
      // Force re-render the component by reloading the page
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling connection request:", error);
      toast.error("Erro ao cancelar solicitação");
    }
  };

  return (
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
      
      {isConnectionPending ? (
        <Button 
          onClick={handleCancelRequest}
          className="gap-1"
          variant="outline"
        >
          <X className="h-4 w-4" /> Cancelar solicitação
        </Button>
      ) : (
        <Button 
          onClick={onConnectionRequest}
          className="gap-1"
          variant="secondary"
        >
          <Handshake className="h-4 w-4" /> Conexão Anticrise
        </Button>
      )}
    </div>
  );
};
