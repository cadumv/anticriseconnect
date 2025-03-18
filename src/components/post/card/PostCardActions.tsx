
import React from "react";
import { Heart, Share2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostCardActionsProps {
  postId: string;
  likes?: number;
  shares?: number;
  comments?: number;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: () => void;
  compact?: boolean;
  likedByUsers?: Array<{id: string, name: string}>;
}

export function PostCardActions({
  postId,
  likes = 0,
  shares = 0,
  comments = 0,
  liked,
  onLike,
  onShare,
  onComment,
  compact = false,
  likedByUsers = []
}: PostCardActionsProps) {
  const isLiked = liked[postId] || false;
  
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
    <div className="border-t border-gray-200">
      <div className="grid grid-cols-4 px-1 py-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onLike(postId)} 
                variant="ghost"
                size="sm"
                className="flex-1 rounded-md hover:bg-gray-100 py-2 h-9"
              >
                <div className="flex items-center justify-center gap-2 w-full text-gray-600">
                  <Heart 
                    size={18}
                    fill={isLiked ? "currentColor" : "none"} 
                    className={isLiked ? "text-red-500" : "text-gray-500"} 
                  />
                  <span className={`text-sm font-medium ${isLiked ? "text-red-500" : ""}`}>Gostei</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatLikedByList()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button
          onClick={onComment}
          variant="ghost"
          size="sm" 
          className="flex-1 rounded-md hover:bg-gray-100 py-2 h-9"
        >
          <div className="flex items-center justify-center gap-2 w-full text-gray-600">
            <MessageSquare size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Comentar</span>
          </div>
        </Button>
        
        <Button
          onClick={() => onShare(postId)}
          variant="ghost"
          size="sm"
          className="flex-1 rounded-md hover:bg-gray-100 py-2 h-9"
        >
          <div className="flex items-center justify-center gap-2 w-full text-gray-600">
            <Share2 size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Compartilhar</span>
          </div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 rounded-md hover:bg-gray-100 py-2 h-9"
        >
          <div className="flex items-center justify-center gap-2 w-full text-gray-600">
            <Send size={18} className="text-gray-500" />
            <span className="text-sm font-medium">Enviar</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
