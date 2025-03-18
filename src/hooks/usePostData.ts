
import { useState, useEffect } from "react";
import { Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";

interface UsePostDataProps {
  postId: string;
}

export function usePostData({ postId }: UsePostDataProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [likedByUsers, setLikedByUsers] = useState<Array<{id: string, name: string}>>([]);
  const [localLikes, setLocalLikes] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const { count, error } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId);
        
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
          .eq('post_id', postId)
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
    
    const fetchLikedByUsers = async () => {
      try {
        if (localLikes > 0) {
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

    if (postId) {
      fetchCommentCount();
      fetchComments();
      
      const postChannel = supabase
        .channel(`post-${postId}`)
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'posts',
            filter: `id=eq.${postId}`
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
  }, [postId, localLikes]);

  return {
    comments,
    isLoadingComments,
    commentCount,
    likedByUsers,
    localLikes,
    setLocalLikes
  };
}
