
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
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, timestamp: string}>>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByUsers, setLikedByUsers] = useState<Array<{id: string, name: string}>>([]);

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
      fetchLikedByUsers();
    }
  }, [post.id]);
  
  // Fetch the users who liked this post
  const fetchLikedByUsers = async () => {
    try {
      // In a real implementation, you would have a likes table
      // For this feature, we'll simulate by fetching profiles
      // and filtering randomly to show some users who "liked" the post
      if (post.likes && post.likes > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Simulate liked users by taking a random subset of profiles
          // In a real implementation, you would query a likes table
          const numLikes = Math.min(post.likes, data.length);
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          const selectedUsers = shuffled.slice(0, numLikes);
          
          setLikedByUsers(selectedUsers);
        }
      }
    } catch (error) {
      console.error("Error fetching liked by users:", error);
    }
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
        onComment={() => {}} // Empty function since we don't toggle comments anymore
        compact={compact}
        likedByUsers={likedByUsers}
      />
      
      {!compact && (
        <CommentSection 
          comments={comments}
          isLoading={isLoadingComments}
          onCancel={() => {}} // Empty function since we don't hide comments anymore
          postId={post.id}
        />
      )}
    </div>
  );
}
