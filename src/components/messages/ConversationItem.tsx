
import { Avatar } from "@/components/ui/avatar";
import { formatMessageDate } from "@/components/chat-dialog/utils";
import { Conversation } from "@/components/messages/types";

interface ConversationItemProps {
  conversation: Conversation;
  onSelect: (recipientId: string, recipientName: string) => void;
}

export const ConversationItem = ({ conversation, onSelect }: ConversationItemProps) => {
  return (
    <div 
      className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
      onClick={() => onSelect(conversation.recipientId, conversation.recipientName)}
    >
      <Avatar className="h-12 w-12 mr-3">
        {conversation.recipientAvatar ? (
          <img 
            src={conversation.recipientAvatar}
            alt={conversation.recipientName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
            {conversation.recipientName.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className="font-medium truncate">{conversation.recipientName}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatMessageDate(conversation.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
      </div>
    </div>
  );
};
