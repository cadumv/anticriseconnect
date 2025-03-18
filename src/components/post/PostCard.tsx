
import { useState, useEffect } from "react";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { PostCardMedia } from "./card/PostCardMedia";
import { PostCardActions } from "./card/PostCardActions";
import { CommentSection } from "./card/CommentSection";
import { Post, Comment } from "@/types/post";
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByUsers, setLikedByUsers] = useState<Array<{id: string, name: string}>>([]);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);

  // Get comment count and likes when the post is loaded
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
    
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            text,
            user_id,
            created_at,
            parent_id,
            post_id,
            likes
          `)
          .eq('post_id', post.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform comments to our Comment type
        const formattedComments: Comment[] = data.map(comment => ({
          id: comment.id,
          text: comment.text,
          author: 'Loading...',
          authorId: comment.user_id,
          timestamp: comment.created_at,
          parentId: comment.parent_id,
          likes: comment.likes || 0,
          post_id: comment.post_id
        }));
        
        setComments(formattedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    if (post.id) {
      fetchCommentCount();
      fetchComments();
      fetchLikedByUsers();
      
      // Subscribe to real-time updates for this post
      const postChannel = supabase
        .channel(`post-${post.id}`)
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'posts',
            filter: `id=eq.${post.id}`
          }, 
          (payload) => {
            const updatedPost = payload.new as any;
            setLocalLikes(updatedPost.likes || 0);
            fetchLikedByUsers(); // Refetch liked by users on update
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(postChannel);
      };
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
          const numLikes = Math.min(localLikes, data.length);
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          const selectedUsers = shuffled.slice(0, numLikes);
          
          setLikedByUsers(selectedUsers);
        }
      } else {
        setLikedByUsers([]);
      }
    } catch (error) {
      console.error("Error fetching liked by users:", error);
    }
  };
  
  // Create a shortened content preview for compact mode
  const contentPreview = post.content && post.content.length > 80 
    ? post.content.substring(0, 80) + '...' 
    : post.content;
  
  // Custom like handler to update UI immediately
  const handlePostLike = (postId: string) => {
    // Call the parent onLike handler
    onLike(postId);
    
    // Update local likes count for immediate feedback
    const isCurrentlyLiked = liked[postId] || false;
    const newLikesCount = isCurrentlyLiked 
      ? Math.max(0, localLikes - 1)
      : localLikes + 1;
    
    setLocalLikes(newLikesCount);
  };
  
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
        likes={localLikes}
        shares={post.shares}
        comments={commentCount}
        liked={liked}
        saved={saved}
        onLike={handlePostLike}
        onSave={onSave}
        onShare={onShare}
        onComment={() => {}} // Empty function since comments are always visible now
        compact={compact}
        likedByUsers={likedByUsers}
      />
      
      {!compact && (
        <CommentSection 
          comments={comments}
          isLoading={isLoadingComments}
          postId={post.id}
        />
      )}
    </div>
  );
}
