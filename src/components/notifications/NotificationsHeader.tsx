
import { Bell } from "lucide-react";

interface NotificationsHeaderProps {
  unreadCount: number;
}

export const NotificationsHeader = ({ unreadCount }: NotificationsHeaderProps) => {
  return (
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
  );
};
