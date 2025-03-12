
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
  
  // Estado local para gerenciar notificações
  const [notifications, setNotifications] = useState<NotificationType[]>([
    // Deixaremos o array vazio para mostrar a interface quando não há notificações
  ]);

  // Estado para filtro de tempo
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  
  // Filtra notificações por tipo e tempo
  const mentions = filterNotificationsByTime(
    notifications.filter(n => n.type === "mention"),
    timeFilter
  );
  
  const partnerships = filterNotificationsByTime(
    notifications.filter(n => n.type === "partnership"),
    timeFilter
  );
  
  // Conta notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Função para marcar notificação como lida
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
  
  // Função para apagar uma notificação
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      description: "Notificação removida com sucesso",
    });
  };
  
  // Função para apagar todas as notificações de um tipo
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    setNotifications(prev => prev.filter(notification => notification.type !== type));
    toast({
      description: `Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`,
    });
  };

  // Função para aceitar uma solicitação de parceria
  const acceptPartnership = (id: string, senderId?: string) => {
    // Lógica para aceitar parceria será implementada aqui
    markAsRead(id);
    toast({
      description: "Solicitação de parceria aceita com sucesso!",
    });
  };

  // Função para recusar uma solicitação de parceria
  const declinePartnership = (id: string) => {
    // Lógica para recusar parceria será implementada aqui
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
        {/* Menções */}
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
        
        {/* Solicitações de Parceria */}
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
