
import { useRef, useEffect } from "react";
import { Message } from "./types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  recipientName: string;
}

export function MessageList({ messages, recipientName }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px] max-h-[400px]">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              recipientName={recipientName} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Nenhuma mensagem ainda. Inicie uma conversa!
          </p>
        </div>
      )}
    </div>
  );
}
