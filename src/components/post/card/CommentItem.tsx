
import React from "react";
import { Comment } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatCommentText } from "./commentUtils";
import { useNavigate } from "react-router-dom";
import CommentReplies from "./CommentReplies";

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
  const navigate = useNavigate();
  
  const handleUserClick = () => {
    if (comment.authorId) {
      navigate(`/profile/${comment.authorId}`);
    }
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

  const formattedCommentHtml = formatCommentText(comment.text);

  return (
    <div className="flex gap-2 mb-3">
      <Avatar className="h-8 w-8 flex-shrink-0 cursor-pointer" onClick={handleUserClick}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={authorName} />
        ) : (
          <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="relative group">
          <div className="bg-gray-100 p-2 rounded-lg">
            <p className="font-bold text-sm cursor-pointer hover:underline" onClick={handleUserClick}>{authorName}</p>
            <div 
              className="text-sm comment-content" 
              dangerouslySetInnerHTML={{ __html: formattedCommentHtml }}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-1 text-xs px-2">
          <button 
            className={`font-medium flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            onClick={onLike}
            aria-label={liked ? "Remover curtida" : "Curtir comentário"}
          >
            <Heart size={12} className={liked ? "fill-red-500" : ""} />
            Gostei
            {comment.likes && comment.likes > 0 && (
              <span className="ml-1">({comment.likes})</span>
            )}
          </button>
          
          <button 
            className="font-medium text-gray-500 hover:text-blue-600"
            onClick={onReply}
          >
            Responder
          </button>
          
          <span className="text-gray-500">{timeAgo(comment.timestamp)}</span>
        </div>
        
        <CommentReplies
          replies={comment.replies}
          depth={depth}
          authorProfiles={authorProfiles}
          likedState={likedState}
          onLikeReply={onLikeReply}
          onReplyToReply={onReplyToReply}
        />
      </div>
    </div>
  );
}

export default CommentItem;
