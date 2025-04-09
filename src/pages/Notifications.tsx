
import { useState, useEffect } from "react";
import { Bell, AtSign, Handshake } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { NotificationType, TimeFilter } from "@/components/notifications/types";
import { NotificationsSection } from "@/components/notifications/NotificationsSection";
import { filterNotificationsByTime } from "@/components/notifications/NotificationsHelper";
import { v4 as uuidv4 } from "uuid";

const Notifications = () => {
  const { user, loading } = useAuth();
  
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  
  // Load notifications from localStorage when the component mounts
  useEffect(() => {
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      const storedNotifications = localStorage.getItem(notificationKey);
      
      if (storedNotifications) {
        try {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error("Error parsing notifications:", error);
        }
      }
    }
  }, [user]);
  
  const mentions = filterNotificationsByTime(
    notifications.filter(n => n.type === "mention"),
    timeFilter
  );
  
  const partnerships = filterNotificationsByTime(
    notifications.filter(n => n.type === "partnership"),
    timeFilter
  );
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
    
    toast("Notificação marcada como lida");
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
    
    toast("Notificação removida com sucesso");
  };
  
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    const updatedNotifications = notifications.filter(notification => notification.type !== type);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
    
    toast(`Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`);
  };

  const acceptPartnership = (id: string, senderId?: string) => {
    if (!senderId || !user) return;
    
    try {
      // Find the connection request from sender
      const connectionKey = `connection_requests_${senderId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const updatedRequests = requests.map((req: any) => {
          if (req.targetId === user.id) {
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
          message: `${user.user_metadata?.name || "Usuário"} aceitou sua solicitação de conexão!`,
          read: false,
          date: new Date().toISOString(),
          link: `/profile/${user.id}`,
          senderId: user.id
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

  const declinePartnership = (id: string, senderId?: string) => {
    if (!senderId || !user) {
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
          if (req.targetId === user.id) {
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
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notificações
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <NotificationsSection
          title="Menções"
          notifications={mentions}
          type="mention"
          icon={<AtSign className="h-5 w-5" />}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          onDeleteAll={deleteAllNotifications}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
        
        <NotificationsSection
          title="Solicitações de Parceria"
          notifications={partnerships}
          type="partnership"
          icon={<Handshake className="h-5 w-5" />}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          onDeleteAll={deleteAllNotifications}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          onAccept={acceptPartnership}
          onDecline={declinePartnership}
        />
      </div>
    </div>
  );
};

export default Notifications;
