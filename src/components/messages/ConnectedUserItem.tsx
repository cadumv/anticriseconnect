
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { ConnectionUser } from "@/utils/connectionUtils";

interface ConnectedUserItemProps {
  user: ConnectionUser;
  onSelect: (recipientId: string, recipientName: string) => void;
}

export const ConnectedUserItem = ({ user, onSelect }: ConnectedUserItemProps) => {
  return (
    <div 
      className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
      onClick={() => onSelect(user.id, user.name)}
    >
      <Avatar className="h-12 w-12 mr-3">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className="font-medium truncate">{user.name}</p>
          <MessageCircle className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 truncate">
          {user.engineering_type || "Engenheiro"}
        </p>
      </div>
    </div>
  );
};
