
import { User } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
}

export const ProfileAvatar = ({ avatarUrl, name }: ProfileAvatarProps) => {
  return (
    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
      {avatarUrl ? (
        <div className="w-full h-full relative">
          <img 
            src={avatarUrl} 
            alt={`Foto de ${name}`} 
            className="avatar-image w-full h-full" 
          />
        </div>
      ) : (
        <User className="h-12 w-12 text-blue-500" />
      )}
    </div>
  );
};
