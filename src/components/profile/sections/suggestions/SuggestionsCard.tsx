
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "./UserList";

interface SuggestedUserData {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface SuggestionsCardProps {
  title: string;
  users: SuggestedUserData[];
  type: 'follow' | 'connect';
  onAction: (userId: string) => void;
  showViewAllLink?: boolean;
}

export const SuggestionsCard = ({
  title,
  users,
  type,
  onAction,
  showViewAllLink = false
}: SuggestionsCardProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <UserList 
          users={users} 
          type={type} 
          onAction={onAction}
          showViewAllLink={showViewAllLink} 
        />
      </CardContent>
    </Card>
  );
};
