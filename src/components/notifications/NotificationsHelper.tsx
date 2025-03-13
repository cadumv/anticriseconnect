
import React from "react";
import { NotificationType, TimeFilter } from "./types";
import { AtSign, Handshake, Bell } from "lucide-react";

export const filterNotificationsByTime = (
  notifications: NotificationType[], 
  timeFilter: TimeFilter
) => {
  if (timeFilter === "all") return notifications;
  
  const now = new Date();
  const filterDate = new Date();
  
  switch (timeFilter) {
    case "day":
      filterDate.setDate(now.getDate() - 1);
      break;
    case "week":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "month":
      filterDate.setMonth(now.getMonth() - 1);
      break;
  }
  
  return notifications.filter(n => new Date(n.date) >= filterDate);
};

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "mention":
      return <AtSign className="h-5 w-5 text-blue-500" />;
    case "partnership":
      return <Handshake className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};
