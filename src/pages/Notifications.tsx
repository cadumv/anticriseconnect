
import { AtSign, Handshake } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsSection } from "@/components/notifications/NotificationsSection";
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader";
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
  
  const { acceptPartnership, declinePartnership, cancelPartnership } = usePartnershipActions(
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
      <NotificationsHeader unreadCount={unreadCount} />
      
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
          onCancel={cancelPartnership}
        />
      </div>
    </div>
  );
};

export default Notifications;
