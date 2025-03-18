
import { useState, useEffect } from "react";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { PostCardMedia } from "./card/PostCardMedia";
import { PostCardActions } from "./card/PostCardActions";
import { CommentSection } from "./card/CommentSection";
import { Post } from "@/types/post";
import { supabase } from "@/lib/supabase";

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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, timestamp: string}>>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // Get comment count when the post is loaded
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const { count, error } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        if (error) throw error;
        
        setCommentCount(count || 0);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };
    
    if (post.id) {
      fetchCommentCount();
    }
  }, [post.id]);

  const loadComments = async () => {
    if (showComments) {
      // If comments are already shown, just hide them
      setShowComments(false);
      return;
    }
    
    // Show the comments section without waiting for the fetch to complete
    setShowComments(true);
  };
  
  // Create a shortened content preview for compact mode
  const contentPreview = post.content && post.content.length > 80 
    ? post.content.substring(0, 80) + '...' 
    : post.content;
  
  return (
    <div className={`rounded-md border bg-white shadow-sm ${compact ? 'text-sm' : ''}`}>
      <PostCardHeader 
        post={post} 
        compact={compact}
        onDelete={onDelete}
      />
      
      <PostCardContent post={post} />
      
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
      
      <PostCardActions 
        postId={post.id}
        likes={post.likes}
        shares={post.shares}
        comments={commentCount}
        liked={liked}
        saved={saved}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
        onComment={loadComments}
        compact={compact}
      />
      
      {showComments && !compact && (
        <CommentSection 
          comments={comments}
          isLoading={isLoadingComments}
          onCancel={() => setShowComments(false)}
          postId={post.id}
        />
      )}
    </div>
  );
}
