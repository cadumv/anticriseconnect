import { useState, useEffect } from "react";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { PostCardMedia } from "./card/PostCardMedia";
import { PostCardActions } from "./card/PostCardActions";
import { CommentSection } from "./card/CommentSection";
import { Post, Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByUsers, setLikedByUsers] = useState<Array<{id: string, name: string}>>([]);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);

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
            fetchLikedByUsers();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(postChannel);
      };
    }
  }, [post.id]);
  
  const fetchLikedByUsers = async () => {
    try {
      if (post.likes && post.likes > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
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
      
      {likedByUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-gray-500 flex items-center border-t">
          <div className="flex -space-x-1 mr-2">
            {likedByUsers.slice(0, 3).map((user, index) => (
              <div 
                key={index} 
                className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <span className="text-[9px] font-bold">{user.name[0].toUpperCase()}</span>
              </div>
            ))}
          </div>
          <span>
            {likedByUsers.length === 1 
              ? <span className="cursor-pointer hover:underline" onClick={() => handleUserClick(likedByUsers[0].id)}>{likedByUsers[0].name}</span>
              : <><span className="cursor-pointer hover:underline" onClick={() => handleUserClick(likedByUsers[0].id)}>{likedByUsers[0].name}</span> e mais {likedByUsers.length - 1} {likedByUsers.length - 1 > 1 ? 'pessoas' : 'pessoa'}</>}
          </span>
          {commentCount > 0 && (
            <>
              <span className="mx-1">•</span>
              <span 
                className="cursor-pointer hover:underline"
                onClick={handleCommentCountClick}
              >
                {commentCount} {commentCount === 1 ? 'comentário' : 'comentários'}
              </span>
            </>
          )}
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
