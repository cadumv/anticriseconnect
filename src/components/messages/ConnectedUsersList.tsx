import { ConnectionUser } from "@/utils/connections";
import { ConnectedUserItem } from "./ConnectedUserItem";

interface ConnectedUsersListProps {
  users: ConnectionUser[];
  searchTerm: string;
  onSelectChat: (recipientId: string, recipientName: string) => void;
}

export const ConnectedUsersList = ({ 
  users, 
  searchTerm, 
  onSelectChat 
}: ConnectedUsersListProps) => {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Conexões</h3>
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <ConnectedUserItem
            key={`user-${user.id}`}
            user={user}
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
};
