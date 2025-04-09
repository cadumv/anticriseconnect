
import { Button } from "@/components/ui/button";
import { Clock, X, Handshake, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileActionButtonsProps {
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionPending: boolean;
  isConnectionAccepted: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
  onCancelConnection?: () => void;
  profileId: string;
  currentUserId: string | undefined;
}

export const ProfileActionButtons = ({
  isFollowing,
  followLoading,
  isConnectionPending,
  isConnectionAccepted,
  onFollowToggle,
  onConnectionRequest,
  onCancelConnection,
  profileId,
  currentUserId
}: ProfileActionButtonsProps) => {
  const [requestLoading, setRequestLoading] = useState(false);

  const handleConnectionAction = async () => {
    if (isConnectionPending) {
      setRequestLoading(true);
      
      try {
        // Get existing connection requests
        const connectionKey = `connection_requests_${currentUserId}`;
        const existingRequests = localStorage.getItem(connectionKey);
        
        if (existingRequests) {
          const requests = JSON.parse(existingRequests);
          // Filter out the request to this profile
          const updatedRequests = requests.filter((req: any) => req.targetId !== profileId);
          
          // Update localStorage
          localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
          
          // Remove notification from target user
          try {
            const targetNotificationsKey = `notifications_${profileId}`;
            const targetNotifications = localStorage.getItem(targetNotificationsKey);
            
            if (targetNotifications) {
              const parsedTargetNotifications = JSON.parse(targetNotifications);
              // Filter out notifications about this connection request
              const updatedTargetNotifications = parsedTargetNotifications.filter((notif: any) => 
                !(notif.senderId === currentUserId && notif.type === "partnership")
              );
              
              localStorage.setItem(targetNotificationsKey, JSON.stringify(updatedTargetNotifications));
            }
          } catch (notifError) {
            console.error("Error removing notification from target:", notifError);
          }
          
          // Remove sender's own notification tracking the request
          const ownNotificationsKey = `notifications_${currentUserId}`;
          const ownNotifications = localStorage.getItem(ownNotificationsKey);
          
          if (ownNotifications) {
            const parsedOwnNotifications = JSON.parse(ownNotifications);
            const updatedOwnNotifications = parsedOwnNotifications.filter((notif: any) => 
              !(notif.link === `/profile/${profileId}` && notif.type === "partnership")
            );
            
            localStorage.setItem(ownNotificationsKey, JSON.stringify(updatedOwnNotifications));
          }
          
          toast.success("Solicitação de conexão cancelada");
        }
      } catch (error) {
        console.error("Error cancelling connection request:", error);
        toast.error("Erro ao cancelar solicitação");
      }
      
      // Force reload to update the UI states
      window.location.reload();
      
      setRequestLoading(false);
    } else {
      onConnectionRequest();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={onFollowToggle}
        disabled={followLoading}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
          isFollowing 
            ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isFollowing ? "Seguindo" : "Seguir"}
      </button>
      
      {isConnectionAccepted ? (
        <button 
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 border border-green-300 bg-green-50 text-green-700"
        >
          <Check className="h-4 w-4" />
          Vocês já possuem uma conexão
        </button>
      ) : isConnectionPending ? (
        <button 
          onClick={handleConnectionAction}
          disabled={requestLoading}
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 h-10 px-4 py-2 border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
        >
          <X className="h-4 w-4" />
          {requestLoading ? "Cancelando..." : "Cancelar solicitação"}
        </button>
      ) : (
        <button 
          onClick={onConnectionRequest}
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Handshake className="h-4 w-4" />
          Conexão Anticrise
        </button>
      )}
    </div>
  );
};
