
import { SuggestedUser } from "./SuggestedUser";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SuggestedUserData {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface UserListProps {
  users: SuggestedUserData[];
  type: 'follow' | 'connect';
  onAction: (userId: string) => void;
  showViewAllLink?: boolean;
}

export const UserList = ({
  users,
  type,
  onAction,
  showViewAllLink = false
}: UserListProps) => {
  if (users.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4 text-center">Nenhuma sugestão disponível no momento.</p>
    );
  }

  return (
    <div className="space-y-1">
      <div className="divide-y">
        {users.map(user => (
          <SuggestedUser
            key={user.id}
            id={user.id}
            name={user.name}
            title={user.title}
            subtitle={user.subtitle}
            avatarUrl={user.avatarUrl}
            isFollowed={user.isFollowing}
            type={type}
            onAction={onAction}
          />
        ))}
      </div>
      
      {showViewAllLink && (
        <div className="w-full mt-2">
          <Link to="/search" className="w-full">
            <Button 
              variant="link" 
              className="w-full text-blue-600" 
              size="sm"
            >
              Exibir tudo
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
