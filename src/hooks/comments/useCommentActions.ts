
import { useState, useEffect } from "react";
import { Comment } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { UseCommentActionsReturn } from "./types";

export function useCommentActions(
  postId: string,
  updateCommentsWithNewComment: (newComment: Comment) => void
): UseCommentActionsReturn {
  const { user } = useAuth();
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  
  // Load liked state from localStorage on component mount
  useEffect(() => {
    if (user) {
      const likedCommentsKey = `user_liked_comments_${user.id}`;
      const storedLikes = localStorage.getItem(likedCommentsKey);
      if (storedLikes) {
        setLiked(JSON.parse(storedLikes));
      }
    }
  }, [user]);

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para curtir comentários.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Update UI state first for immediate feedback
      const isLiked = liked[commentId] || false;
      const newLiked = { ...liked, [commentId]: !isLiked };
      setLiked(newLiked);
      
      // Save to localStorage for persistence between sessions
      localStorage.setItem(`user_liked_comments_${user.id}`, JSON.stringify(newLiked));
      
      // Get current comment data
      const { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('likes')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new likes count
      const currentLikes = comment?.likes || 0;
      const newLikesCount = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
      
      // Update the likes count in the database
      const { error: updateError } = await supabase
        .from('comments')
        .update({ likes: newLikesCount })
        .eq('id', commentId);
      
      if (updateError) throw updateError;
      
    } catch (error) {
      console.error('Error updating comment like:', error);
      toast({
        title: "Erro ao curtir comentário",
        description: "Não foi possível atualizar o status do like.",
        variant: "destructive"
      });
      
      // Revert UI state if there was an error
      const revertedLiked = { ...liked };
      delete revertedLiked[commentId];
      setLiked(revertedLiked);
    }
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
    replyTo,
    setReplyTo,
    handleLikeComment,
    postComment,
  };
}
