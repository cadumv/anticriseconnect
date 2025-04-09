
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
}

export const ProfileAvatar = ({ avatarUrl, name }: ProfileAvatarProps) => {
  return (
    <div className="relative w-24 h-24">
      <Avatar className="w-full h-full border-2 border-background">
        {avatarUrl ? (
          <AvatarImage 
            src={avatarUrl} 
            alt={`Foto de ${name}`}
            className="object-contain"
          />
        ) : (
          <AvatarFallback className="bg-blue-100 text-blue-500">
            {name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}
