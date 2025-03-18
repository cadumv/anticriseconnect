
import { Badge } from "@/components/ui/badge";
import { AtSign } from "lucide-react";

interface ProfileInfoProps {
  name: string;
  username?: string;
  engineeringType: string;
}

export const ProfileInfo = ({ name, username, engineeringType }: ProfileInfoProps) => {
  return (
    <div className="text-left">
      <h2 className="text-2xl font-semibold">{name}</h2>
      {username && (
        <div className="flex items-center text-gray-600 mt-1">
          <AtSign className="h-4 w-4 mr-1" />
          <span>{username}</span>
        </div>
      )}
      {engineeringType && (
        <Badge className="mt-2">{engineeringType}</Badge>
      )}
    </div>
  );
};
