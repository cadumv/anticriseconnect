
import React from "react";
import { Heart } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  onLike: (postId: string) => void;
  likedByUsers?: Array<{id: string, name: string}>;
}

export function LikeButton({ postId, isLiked, onLike, likedByUsers = [] }: LikeButtonProps) {
  const formatLikedByList = () => {
    if (likedByUsers.length === 0) return "Ninguém curtiu ainda";
    
    if (likedByUsers.length <= 3) {
      return likedByUsers.map(user => user.name).join(", ");
    } else {
      const firstUsers = likedByUsers.slice(0, 3).map(user => user.name).join(", ");
      return `${firstUsers} e ${likedByUsers.length - 3} outros`;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <ActionButton
              onClick={() => onLike(postId)}
              icon={Heart}
              label="Gostei"
              isActive={isLiked}
              activeColor="text-red-500"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formatLikedByList()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
