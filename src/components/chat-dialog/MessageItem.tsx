
import { Avatar } from "@/components/ui/avatar";
import { Message } from "./types";
import { formatMessageDate } from "./utils";

interface MessageItemProps {
  message: Message;
  recipientName: string;
}

export function MessageItem({ message, recipientName }: MessageItemProps) {
  return (
    <div 
      className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!message.isFromCurrentUser && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-700 font-semibold">
            {recipientName.charAt(0).toUpperCase()}
          </div>
        </Avatar>
      )}
      <div 
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          message.isFromCurrentUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        {message.imageUrl && (
          <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={message.imageUrl} 
              alt="Message attachment" 
              className="rounded-lg max-h-60 max-w-full mb-2 object-contain"
            />
          </a>
        )}
        {message.content && <p className="break-words">{message.content}</p>}
        <span className={`text-xs block mt-1 ${message.isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatMessageDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
