
import { useState, useEffect } from "react";
import { Bell, AtSign, Handshake } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { NotificationType, TimeFilter } from "@/components/notifications/types";
import { NotificationsSection } from "@/components/notifications/NotificationsSection";
import { filterNotificationsByTime } from "@/components/notifications/NotificationsHelper";

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
    
    toast({
      description: "Notificação marcada como lida",
    });
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
    
    toast({
      description: "Notificação removida com sucesso",
    });
  };
  
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    const updatedNotifications = notifications.filter(notification => notification.type !== type);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    if (user) {
      const notificationKey = `notifications_${user.id}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
    
    toast({
      description: `Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`,
    });
  };

  const acceptPartnership = (id: string, senderId?: string) => {
    if (!senderId || !user) return;
    
    // Find the connection request
    const connectionKey = `connection_requests_${senderId}`;
    const existingRequests = localStorage.getItem(connectionKey);
    
    if (existingRequests) {
      try {
        const requests = JSON.parse(existingRequests);
        const updatedRequests = requests.map((req: any) => {
          if (req.targetId === user.id) {
            return { ...req, status: 'accepted' };
          }
          return req;
        });
        
        // Update the connection request status
        localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
        
        // Mark notification as read
        markAsRead(id);
        
        toast({
          description: "Solicitação de parceria aceita com sucesso!",
        });
        
        // Refresh the page to update connection status
        window.location.reload();
      } catch (error) {
        console.error("Error accepting partnership:", error);
      }
    }
  };

  const declinePartnership = (id: string) => {
    // For now, just delete the notification
    deleteNotification(id);
    toast({
      description: "Solicitação de parceria recusada.",
    });
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
