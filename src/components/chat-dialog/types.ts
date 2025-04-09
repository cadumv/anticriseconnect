
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

export interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}
