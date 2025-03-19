
import { Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { UseCommentRealtimeReturn } from "./types";

type CommentStateUpdater = React.Dispatch<React.SetStateAction<Comment[]>>;

export function useCommentRealtime(
  postId: string,
  setComments: CommentStateUpdater,
  fetchUserProfiles: (userIds: string[]) => Promise<void>
): UseCommentRealtimeReturn {
  const { user } = useAuth();

  const setupRealtimeSubscription = () => {
    const commentsChannel = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, 
        (payload) => {
          const newComment = payload.new as any;
          
          // Only add if it's a new comment, not from the current user
          if (newComment.user_id !== user?.id) {
            const commentData: Comment = {
              id: newComment.id,
              text: newComment.text,
              author: 'Loading...',
              authorId: newComment.user_id,
              timestamp: newComment.created_at,
              parentId: newComment.parent_id,
              likes: newComment.likes || 0,
              post_id: newComment.post_id
            };
            
            updateCommentsWithNewComment(commentData);
            fetchUserProfiles([newComment.user_id]);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          const updatedComment = payload.new as any;
          // Update the comment in the state
          setComments(prevComments => {
            return updateCommentInList(prevComments, {
              id: updatedComment.id,
              likes: updatedComment.likes || 0
            });
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(commentsChannel);
    };
  };
  
  const updateCommentInList = (comments: Comment[], updates: Partial<Comment>): Comment[] => {
    return comments.map(comment => {
      if (comment.id === updates.id) {
        return { ...comment, ...updates };
      }
      
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInList(comment.replies, updates)
        };
      }
      
      return comment;
    });
  };
  
  const updateCommentsWithNewComment = (newComment: Comment) => {
    setComments(prevComments => {
      // If it's a reply to another comment
      if (newComment.parentId) {
        const updatedComments = prevComments.map(comment => {
          if (comment.id === newComment.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentWithNewReply(comment.replies, newComment)
            };
          }
          
          return comment;
        });
        return updatedComments;
      } else {
        // It's a top-level comment
        return [newComment, ...prevComments];
      }
    });
  };
  
  const updateCommentWithNewReply = (replies: Comment[], newReply: Comment): Comment[] => {
    return replies.map(reply => {
      if (reply.id === newReply.parentId) {
        return {
          ...reply,
          replies: [...(reply.replies || []), newReply]
        };
      }
      
      if (reply.replies && reply.replies.length > 0) {
        return {
          ...reply,
          replies: updateCommentWithNewReply(reply.replies, newReply)
        };
      }
      
      return reply;
    });
  };

  return {
    setupRealtimeSubscription,
    updateCommentsWithNewComment,
  };
}
