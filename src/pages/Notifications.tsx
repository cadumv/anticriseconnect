
import { useState } from "react";
import { Bell, AtSign, Handshake } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsSection } from "@/components/notifications/NotificationsSection";
import { useNotifications } from "@/hooks/useNotifications";
import { usePartnershipActions } from "@/hooks/usePartnershipActions";

const Notifications = () => {
  const { user, loading } = useAuth();
  
  // Use our custom hooks
  const {
    timeFilter,
    setTimeFilter,
    mentions,
    partnerships,
    unreadCount,
    markAsRead,
    deleteNotification,
    deleteAllNotifications
  } = useNotifications(user?.id);
  
  const { acceptPartnership, declinePartnership } = usePartnershipActions(
    user?.id, 
    markAsRead, 
    deleteNotification
  );
  
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
