
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function usePartnershipActions(userId: string | undefined, markAsRead: (id: string) => void, deleteNotification: (id: string) => void) {
  // Accept a partnership request
  const acceptPartnership = (id: string, senderId?: string) => {
    if (!senderId || !userId) return;
    
    try {
      // Find the connection request from sender
      const connectionKey = `connection_requests_${senderId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const updatedRequests = requests.map((req: any) => {
          if (req.targetId === userId) {
            return { ...req, status: 'accepted' };
          }
          return req;
        });
        
        // Update the connection request status
        localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
        
        // Create notification for the sender that their request was accepted
        const notification = {
          id: uuidv4(),
          type: "partnership",
          message: `${userId} aceitou sua solicitação de conexão!`,
          read: false,
          date: new Date().toISOString(),
          link: `/profile/${userId}`,
          senderId: userId
        };
        
        const senderNotificationsKey = `notifications_${senderId}`;
        const senderNotifications = localStorage.getItem(senderNotificationsKey);
        const parsedSenderNotifications = senderNotifications ? JSON.parse(senderNotifications) : [];
        parsedSenderNotifications.push(notification);
        localStorage.setItem(senderNotificationsKey, JSON.stringify(parsedSenderNotifications));
        
        // Mark notification as read
        markAsRead(id);
        
        toast.success("Solicitação de parceria aceita com sucesso!");
      }
    } catch (error) {
      console.error("Error accepting partnership:", error);
      toast.error("Erro ao aceitar a solicitação");
    }
  };

  // Decline a partnership request
  const declinePartnership = (id: string, senderId?: string) => {
    if (!senderId || !userId) {
      // Just delete the notification if we don't have a sender ID
      deleteNotification(id);
      return;
    }
    
    try {
      // Find the connection request from sender
      const connectionKey = `connection_requests_${senderId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const updatedRequests = requests.map((req: any) => {
          if (req.targetId === userId) {
            return { ...req, status: 'declined' };
          }
          return req;
        });
        
        // Update the connection request status
        localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
      }
      
      // Delete the notification
      deleteNotification(id);
      toast("Solicitação de parceria recusada.");
    } catch (error) {
      console.error("Error declining partnership:", error);
      toast.error("Erro ao recusar a solicitação");
    }
  };

  return {
    acceptPartnership,
    declinePartnership
  };
}
