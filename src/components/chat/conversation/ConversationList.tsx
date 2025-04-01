
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  searchTerm: string;
  activeChat: string | null;
  onSearchChange: (value: string) => void;
  onSelectChat: (recipientId: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  searchTerm,
  activeChat,
  onSearchChange,
  onSelectChat
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatConversationTime = (timestamp: string) => {
    const msgDate = new Date(timestamp);
    const today = new Date();
    
    // If message is from today, show time only
    if (msgDate.toDateString() === today.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return msgDate.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="w-full sm:w-1/3 border-r">
      <div className="relative p-4 border-b">
        <Search className="absolute left-6 top-6.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar mensagens..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[calc(85vh-130px)]">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-pulse">Carregando conversas...</div>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                activeChat === conversation.recipientId ? 'bg-blue-50' : ''
              } ${conversation.unread ? 'bg-blue-50/50' : ''}`}
              onClick={() => onSelectChat(conversation.recipientId)}
            >
              <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                {conversation.recipientAvatar ? (
                  <img 
                    src={conversation.recipientAvatar}
                    alt={conversation.recipientName}
                    className="h-full w-full object-contain" // Changed from object-cover to object-contain
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
                    {conversation.recipientName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className={`font-medium truncate ${conversation.unread ? 'font-semibold' : ''}`}>
                    {conversation.recipientName}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatConversationTime(conversation.timestamp)}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'text-black font-medium' : 'text-gray-500'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="w-2 h-2 bg-blue-600 rounded-full ml-1 flex-shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <MessageCircle className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">
              {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400">
                Visite os perfis dos profissionais para iniciar uma conversa
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
