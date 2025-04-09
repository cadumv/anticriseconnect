
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostAvatarProps {
  avatarUrl: string | null;
  displayName: string;
  compact?: boolean;
  onClick: () => void;
}

export function PostAvatar({ 
  avatarUrl, 
  displayName, 
  compact = false, 
  onClick 
}: PostAvatarProps) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={displayName} />
        ) : (
          <AvatarFallback>{displayName[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}
