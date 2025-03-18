
import { useState } from "react";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { PostCardMedia } from "./card/PostCardMedia";
import { PostCardActions } from "./card/PostCardActions";
import { CommentSection } from "./card/CommentSection";
import { Post } from "@/types/post";
import { useNavigate } from "react-router-dom";
import { usePostData } from "@/hooks/usePostData";
import { PostInteractions } from "./card/PostInteractions";

interface PostCardProps {
  post: Post;
  liked: Record<string, boolean>;
  saved?: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function PostCard({ 
  post, 
  liked, 
  saved = {},
  onLike, 
  onSave,
  onShare, 
  onDelete,
  compact = false 
}: PostCardProps) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  
  const {
    comments,
    isLoadingComments,
    commentCount,
    likedByUsers,
    localLikes,
    setLocalLikes
  } = usePostData({ postId: post.id });

  const handleUserClick = (userId: string) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleCommentCountClick = () => {
    if (compact) {
      return;
    }
    setShowComments(true);
  };
  
  const contentPreview = post.content && post.content.length > 80 
    ? post.content.substring(0, 80) + '...' 
    : post.content;
  
  const handlePostLike = (postId: string) => {
    onLike(postId);
    
    const isCurrentlyLiked = liked[postId] || false;
    const newLikesCount = isCurrentlyLiked 
      ? Math.max(0, localLikes - 1)
      : localLikes + 1;
    
    setLocalLikes(newLikesCount);
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };
  
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <PostCardHeader 
        post={post} 
        compact={compact}
        onDelete={onDelete}
        onUserClick={() => handleUserClick(post.user_id || '')}
      />
      
      {!compact && post.content && (
        <div className="px-4 py-2">
          <p className="text-gray-800">{post.content}</p>
        </div>
      )}
      
      <PostCardMedia 
        imageUrl={post.imageUrl} 
        title={post.title} 
        compact={compact}
      />
      
      {compact && post.content && (
        <div className="px-3 py-1">
          <p className="text-gray-800 text-xs line-clamp-2">{contentPreview}</p>
        </div>
      )}
      
      <PostInteractions
        likedByUsers={likedByUsers}
        commentCount={commentCount}
        onUserClick={handleUserClick}
        onCommentCountClick={handleCommentCountClick}
      />
      
      <PostCardActions 
        postId={post.id}
        likes={localLikes}
        shares={post.shares}
        comments={commentCount}
        liked={liked}
        saved={saved}
        onLike={handlePostLike}
        onSave={onSave}
        onShare={onShare}
        onComment={toggleComments}
        compact={compact}
        likedByUsers={likedByUsers}
      />
      
      {(!compact && showComments) && (
        <CommentSection 
          comments={comments}
          isLoading={isLoadingComments}
          postId={post.id}
        />
      )}
    </div>
  );
}
