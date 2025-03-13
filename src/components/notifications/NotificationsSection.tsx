import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationType, TimeFilter } from "./types";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "./EmptyState";
import { filterNotificationsByTime } from "./NotificationsHelper";

interface NotificationsSectionProps {
  title: React.ReactNode;
  notifications: NotificationType[];
  type: "mention" | "partnership";
  icon: React.ReactNode;
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  onDeleteAll: (type: "mention" | "partnership") => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAccept?: (id: string, senderId?: string) => void;
  onDecline?: (id: string) => void;
}

export const NotificationsSection = ({
  title,
  notifications,
  type,
  icon,
  timeFilter,
  onTimeFilterChange,
  onDeleteAll,
  onMarkAsRead,
  onDelete,
  onAccept,
  onDecline
}: NotificationsSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <TimeFilterSelector 
            timeFilter={timeFilter} 
            onTimeFilterChange={onTimeFilterChange}
          />
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDeleteAll(type)}
              className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Limpar todas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                icon={icon}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                onAccept={onAccept}
                onDecline={onDecline}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={type} />
        )}
      </CardContent>
    </Card>
  );
};
