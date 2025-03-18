
import React from "react";
import { Comment } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply } from "lucide-react";
import { formatCommentText } from "./commentUtils";

interface CommentItemProps {
  comment: Comment;
  avatarUrl: string | null;
  authorName: string;
  liked: boolean;
  onLike: () => void;
  onReply: () => void;
  depth: number;
  authorProfiles: Record<string, { avatar_url: string, name: string }>;
  likedState: Record<string, boolean>;
  onLikeReply: (commentId: string) => void;
  onReplyToReply: (comment: Comment) => void;
}

export function CommentItem({
  comment,
  avatarUrl,
  authorName,
  liked,
  onLike,
  onReply,
  depth,
  authorProfiles,
  likedState,
  onLikeReply,
  onReplyToReply
}: CommentItemProps) {
  // Maximum nesting level allowed
  const MAX_DEPTH = 3;
  
  const renderReplies = () => {
    if (!comment.replies || comment.replies.length === 0) return null;
    
    return (
      <div className={`ml-8 mt-2 space-y-3 ${depth >= MAX_DEPTH ? 'pl-2 border-l-2 border-gray-200' : ''}`}>
        {comment.replies.map(reply => {
          const profileInfo = reply.authorId ? authorProfiles[reply.authorId] : null;
          const replyAvatarUrl = reply.authorAvatar || (profileInfo ? profileInfo.avatar_url : null);
          const replyAuthorName = reply.author !== 'Loading...' ? reply.author : (profileInfo ? profileInfo.name : 'Usuário');
          const isReplyLiked = likedState[reply.id] || false;
          
          // If we've reached max depth, we'll flatten the replies
          if (depth >= MAX_DEPTH) {
            return (
              <CommentItem
                key={reply.id}
                comment={{...reply, replies: []}}
                avatarUrl={replyAvatarUrl}
                authorName={replyAuthorName}
                liked={isReplyLiked}
                onLike={() => onLikeReply(reply.id)}
                onReply={() => onReplyToReply(reply)}
                depth={depth + 1}
                authorProfiles={authorProfiles}
                likedState={likedState}
                onLikeReply={onLikeReply}
                onReplyToReply={onReplyToReply}
              />
            );
          } else {
            return (
              <CommentItem
                key={reply.id}
                comment={reply}
                avatarUrl={replyAvatarUrl}
                authorName={replyAuthorName}
                liked={isReplyLiked}
                onLike={() => onLikeReply(reply.id)}
                onReply={() => onReplyToReply(reply)}
                depth={depth + 1}
                authorProfiles={authorProfiles}
                likedState={likedState}
                onLikeReply={onLikeReply}
                onReplyToReply={onReplyToReply}
              />
            );
          }
        })}
      </div>
    );
  };
  
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={authorName} />
        ) : (
          <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="font-medium text-sm">{authorName}</p>
          <div 
            className="text-sm" 
            dangerouslySetInnerHTML={{ __html: formatCommentText(comment.text) }}
          />
        </div>
        <div className="flex gap-4 mt-1 text-xs text-gray-500">
          <span>
            {new Date(comment.timestamp).toLocaleDateString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          
          <button 
            className="flex items-center gap-1 hover:text-blue-600"
            onClick={onReply}
          >
            <Reply size={14} />
            Responder
          </button>
          
          <button 
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
            onClick={onLike}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
            {comment.likes && comment.likes > 0 ? comment.likes : ""} Curtir
          </button>
        </div>
        
        {renderReplies()}
      </div>
    </div>
  );
}
