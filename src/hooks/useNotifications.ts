
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { NotificationType, TimeFilter } from "@/components/notifications/types";
import { filterNotificationsByTime } from "@/components/notifications/NotificationsHelper";

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  
  // Load notifications from localStorage when the component mounts
  useEffect(() => {
    if (userId) {
      const notificationKey = `notifications_${userId}`;
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
  }, [userId]);

  // Filter notifications by type and time
  const getMentions = () => filterNotificationsByTime(
    notifications.filter(n => n.type === "mention"),
    timeFilter
  );
  
  const getPartnerships = () => filterNotificationsByTime(
    notifications.filter(n => n.type === "partnership"),
    timeFilter
  );
  
  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  // Update localStorage with new notifications
  const updateNotificationsStorage = (updatedNotifications: NotificationType[]) => {
    if (userId) {
      const notificationKey = `notifications_${userId}`;
      localStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
    }
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    updateNotificationsStorage(updatedNotifications);
    toast("Notificação marcada como lida");
  };
  
  // Delete a notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    updateNotificationsStorage(updatedNotifications);
    toast("Notificação removida com sucesso");
  };
  
  // Delete all notifications of a specific type
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    const updatedNotifications = notifications.filter(notification => notification.type !== type);
    setNotifications(updatedNotifications);
    updateNotificationsStorage(updatedNotifications);
    toast(`Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`);
  };

  return {
    notifications,
    timeFilter,
    setTimeFilter,
    mentions: getMentions(),
    partnerships: getPartnerships(),
    unreadCount: getUnreadCount(),
    markAsRead,
    deleteNotification,
    deleteAllNotifications
  };
}
