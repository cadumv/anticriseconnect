
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface ProfileHeaderAvatarProps {
  user: User | null;
}

export const ProfileHeaderAvatar = ({ user }: ProfileHeaderAvatarProps) => {
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  useEffect(() => {
    // Force avatar refresh on user metadata change
    if (user?.user_metadata?.avatar_url) {
      setAvatarKey(Date.now());
    }
  }, [user]);
  
  return (
    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
      {user?.user_metadata?.avatar_url ? (
        <div className="w-full h-full">
          <img 
            src={`${user.user_metadata.avatar_url}?v=${avatarKey}`} 
            alt="Foto de perfil" 
            className="avatar-image" 
          />
        </div>
      ) : (
        <span className="text-3xl font-bold text-blue-500">
          {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
        </span>
      )}
    </div>
  );
};
