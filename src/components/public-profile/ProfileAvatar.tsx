
import { User } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
}

export const ProfileAvatar = ({ avatarUrl, name }: ProfileAvatarProps) => {
  return (
    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
      {avatarUrl ? (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={avatarUrl} 
            alt={`Foto de ${name}`} 
            className="max-h-full max-w-full object-contain" 
          />
        </div>
      ) : (
        <User className="h-12 w-12 text-blue-500" />
      )}
    </div>
  );
}
