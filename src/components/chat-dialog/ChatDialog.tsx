
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { RatingSystem } from "./RatingSystem";
import { MessageInput } from "./MessageInput";
import { useChatMessages } from "./useChatMessages";
import { ChatDialogProps } from "./types";

export function ChatDialog({
  isOpen,
  onClose,
  recipientId,
  recipientName,
}: ChatDialogProps) {
  const { messages, rating, handleSendMessage } = useChatMessages(recipientId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <ChatHeader recipientName={recipientName} />
        
        {/* Message list */}
        <MessageList 
          messages={messages} 
          recipientName={recipientName} 
        />
        
        {/* Rating system */}
        {messages.length > 0 && (
          <RatingSystem 
            initialRating={rating} 
            recipientId={recipientId} 
          />
        )}
        
        {/* Message input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </DialogContent>
    </Dialog>
  );
}
