
export interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
}
