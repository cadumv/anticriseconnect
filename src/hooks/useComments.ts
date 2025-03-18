
import { useState, useEffect } from "react";
import { Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface AuthorProfile {
  avatar_url: string;
  name: string;
}

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorProfiles, setAuthorProfiles] = useState<Record<string, AuthorProfile>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [mentionUsers, setMentionUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Load liked comments from localStorage
    if (user) {
      const likedCommentsKey = `user_liked_comments_${user.id}`;
      const storedLikes = localStorage.getItem(likedCommentsKey);
      if (storedLikes) {
        setLiked(JSON.parse(storedLikes));
      }
    }
    
    fetchProfiles();
    fetchComments();
    
    // Subscribe to real-time updates
    const cleanup = setupRealtimeSubscription();
    
    return cleanup;
  }, [postId, user?.id]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .limit(100);
      
      if (error) throw error;
      
      if (data) {
        setMentionUsers(data.map(p => ({ id: p.id, name: p.name || 'Usuário' })));
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };
  
  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setIsLoading(true);
      
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
      
      // Organize comments into a thread structure with parent and replies
      const threadedComments = organizeCommentsIntoThreads(formattedComments);
      
      setComments(threadedComments);
      
      // Fetch user profiles for all comments and replies
      const userIds = Array.from(new Set(
        data.map(c => c.user_id)
      ));
      
      if (userIds.length > 0) {
        await fetchUserProfiles(userIds as string[]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erro ao carregar comentários",
        description: "Não foi possível carregar os comentários deste post.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfiles = async (userIds: string[]) => {
    try {
      if (userIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, avatar_url, name')
        .in('id', userIds);
      
      if (error) throw error;
      
      const profileMap: Record<string, AuthorProfile> = {};
      data?.forEach(profile => {
        profileMap[profile.id] = { 
          avatar_url: profile.avatar_url || '', 
          name: profile.name || 'Usuário' 
        };
      });
      
      setAuthorProfiles(prev => ({...prev, ...profileMap}));
    } catch (error) {
      console.error('Error fetching author profiles:', error);
    }
  };

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
  
  const organizeCommentsIntoThreads = (comments: Comment[]): Comment[] => {
    const topLevelComments: Comment[] = [];
    const replyMap: Record<string, Comment[]> = {};
    
    // Group replies by parent ID
    comments.forEach(comment => {
      if (comment.parentId) {
        if (!replyMap[comment.parentId]) {
          replyMap[comment.parentId] = [];
        }
        replyMap[comment.parentId].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });
    
    // Add replies to their parent comments
    const addRepliesToComments = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(comment => {
        const replies = replyMap[comment.id] || [];
        return {
          ...comment,
          replies: addRepliesToComments(replies)
        };
      });
    };
    
    return addRepliesToComments(topLevelComments);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    
    // Update UI state first for immediate feedback
    const isLiked = liked[commentId] || false;
    const newLiked = { ...liked, [commentId]: !isLiked };
    setLiked(newLiked);
    
    // Save to localStorage
    localStorage.setItem(`user_liked_comments_${user.id}`, JSON.stringify(newLiked));
  };

  const postComment = async (text: string, parentId: string | null = null) => {
    if (!text.trim() || !user || !postId) return;
    
    try {
      const commentData = {
        post_id: postId,
        user_id: user.id,
        text: text,
        parent_id: parentId,
        likes: 0
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select('id, created_at')
        .single();
      
      if (error) throw error;
      
      const newComment: Comment = {
        id: data.id,
        text: text,
        author: user.user_metadata?.name || "Usuário",
        authorId: user.id,
        authorAvatar: user.user_metadata?.avatar_url,
        timestamp: data.created_at,
        parentId: parentId,
        likes: 0,
        post_id: postId
      };
      
      // Update the comments state
      updateCommentsWithNewComment(newComment);
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso."
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível publicar seu comentário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    comments,
    isLoading,
    liked,
    replyTo,
    authorProfiles,
    mentionUsers,
    setReplyTo,
    handleLikeComment,
    postComment,
    organizeCommentsIntoThreads,
  };
}
