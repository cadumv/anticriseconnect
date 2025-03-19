
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface MessageListProps {
  messages: Message[];
  activeConversation: Conversation | undefined;
}

export function MessageList({ messages, activeConversation }: MessageListProps) {
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isFromCurrentUser && (
                <Avatar className="h-6 w-6 mr-2 mt-1 flex-shrink-0">
                  {activeConversation?.recipientAvatar ? (
                    <img 
                      src={activeConversation.recipientAvatar}
                      alt={activeConversation.recipientName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs font-medium">
                      {activeConversation?.recipientName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] px-3 py-2 rounded-lg ${
                  msg.isFromCurrentUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="break-words text-sm">{msg.content}</p>
                <span className={`text-xs block mt-1 ${msg.isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Nenhuma mensagem ainda. Inicie uma conversa!
          </p>
        </div>
      )}
    </ScrollArea>
  );
}
