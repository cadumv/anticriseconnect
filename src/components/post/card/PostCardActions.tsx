
import React from "react";
import { Heart, Share2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  compact = false
}: PostCardActionsProps) {
  const isLiked = liked[postId] || false;
  
  const buttonClasses = compact 
    ? "h-8 gap-1 px-2 text-xs"
    : "h-9 gap-2 px-3";
    
  const iconSize = compact ? 14 : 18;
  
  return (
    <div className={`flex items-center justify-between px-4 py-1 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-1">
        <Button
          onClick={() => onLike(postId)} 
          variant="ghost"
          size="sm"
          className={buttonClasses}
        >
          <Heart 
            size={iconSize}
            fill={isLiked ? "currentColor" : "none"} 
            className={isLiked ? "text-red-500" : "text-gray-500"} 
          />
          <span>{likes > 0 ? likes : ''}</span>
        </Button>
        
        <Button
          onClick={onComment}
          variant="ghost"
          size="sm"
          className={buttonClasses}
        >
          <MessageSquare size={iconSize} className="text-gray-500" />
          <span>{comments > 0 ? comments : ''}</span>
        </Button>
        
        <Button
          onClick={() => onShare(postId)}
          variant="ghost"
          size="sm"
          className={buttonClasses}
        >
          <Share2 size={iconSize} className="text-gray-500" />
          <span>{shares > 0 ? shares : ''}</span>
        </Button>
      </div>
      
      {/* Save button removed */}
    </div>
  );
}
