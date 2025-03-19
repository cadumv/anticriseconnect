
import React from "react";
import { LikeButton } from "./actions/LikeButton";
import { CommentButton } from "./actions/CommentButton";
import { ShareButton } from "./actions/ShareButton";
import { SaveButton } from "./actions/SaveButton";

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
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  onComment,
  likedByUsers = []
}: PostCardActionsProps) {
  const isLiked = liked[postId] || false;
  const isSaved = saved[postId] || false;
  
  const handleSaveClick = () => {
    if (onSave) {
      onSave(postId);
    } else {
      console.error("Save handler not provided");
    }
  };
  
  return (
    <div className="border-t border-gray-200">
      <div className="grid grid-cols-4 px-1 py-1">
        <LikeButton 
          postId={postId} 
          isLiked={isLiked} 
          onLike={onLike} 
          likedByUsers={likedByUsers} 
        />
        
        <CommentButton onComment={onComment} />
        
        <ShareButton postId={postId} onShare={onShare} />

        <SaveButton postId={postId} isSaved={isSaved} onSave={handleSaveClick} />
      </div>
    </div>
  );
}
