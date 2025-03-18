
import React from "react";
import { Comment } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}m`;
    
    return `${Math.floor(diffInMonths / 12)}a`;
  };

  return (
    <div className="flex gap-2 mb-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={authorName} />
        ) : (
          <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="relative group">
          <div className="bg-gray-100 p-2 rounded-lg">
            <p className="font-medium text-sm">{authorName}</p>
            <div 
              className="text-sm" 
              dangerouslySetInnerHTML={{ __html: formatCommentText(comment.text) }}
            />
          </div>
          <div className="absolute bottom-0 right-0 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            {liked ? (
              <div className="bg-red-100 text-red-500 rounded-full p-1 shadow-sm">
                <Heart size={12} fill="currentColor" />
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="flex gap-3 mt-1 text-xs px-2">
          <button 
            className={`font-medium ${liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={onLike}
          >
            Gostei
          </button>
          
          <button 
            className="font-medium text-gray-500 hover:text-blue-600"
            onClick={onReply}
          >
            Responder
          </button>
          
          <span className="text-gray-500">{timeAgo(comment.timestamp)}</span>
        </div>
        
        {renderReplies()}
      </div>
    </div>
  );
}

export default CommentItem;
