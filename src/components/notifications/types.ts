
export interface NotificationType {
  id: string;
  type: "mention" | "partnership";
  message: string;
  read: boolean;
  date: string;
  link: string;
  // For partnership notifications
  senderId?: string;
}

export type TimeFilter = "all" | "day" | "week" | "month";
