
import { MessageCircle } from "lucide-react";
import { Conversation } from "@/components/messages/types";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  searchTerm: string;
  onSelectChat: (recipientId: string, recipientName: string) => void;
}

export const ConversationList = ({ 
  conversations, 
  searchTerm, 
  onSelectChat 
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredConversations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Conversas iniciadas</h3>
      <div className="space-y-2">
        {filteredConversations.map(conversation => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
};
