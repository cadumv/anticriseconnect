import { useState } from "react";
import { Bell, AtSign, Handshake } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { NotificationType, TimeFilter } from "@/components/notifications/types";
import { NotificationsSection } from "@/components/notifications/NotificationsSection";
import { filterNotificationsByTime } from "@/components/notifications/NotificationsHelper";

const Notifications = () => {
  const { user, loading } = useAuth();
  
  const [notifications, setNotifications] = useState<NotificationType[]>([
  ]);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  
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
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    toast({
      description: "Notificação marcada como lida",
    });
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      description: "Notificação removida com sucesso",
    });
  };
  
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    setNotifications(prev => prev.filter(notification => notification.type !== type));
    toast({
      description: `Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`,
    });
  };

  const acceptPartnership = (id: string, senderId?: string) => {
    markAsRead(id);
    toast({
      description: "Solicitação de parceria aceita com sucesso!",
    });
  };

  const declinePartnership = (id: string) => {
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
