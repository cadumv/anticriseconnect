
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function useUnreadNotifications(user: User | null) {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      // Check for unread notifications
      const checkUnreadNotifications = () => {
        const notificationKey = `notifications_${user.id}`;
        const storedNotifications = localStorage.getItem(notificationKey);
        
        if (storedNotifications) {
          try {
            const parsedNotifications = JSON.parse(storedNotifications);
            const unreadNotifications = parsedNotifications.filter((n: any) => !n.read);
            setUnreadCount(unreadNotifications.length);
          } catch (error) {
            console.error("Error parsing notifications:", error);
          }
        }
      };
      
      checkUnreadNotifications();
      
      // Check for new notifications every 30 seconds
      const interval = setInterval(checkUnreadNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  return unreadCount;
}
