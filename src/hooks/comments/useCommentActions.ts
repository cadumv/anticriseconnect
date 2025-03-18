
import { useState } from "react";
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
    replyTo,
    setReplyTo,
    handleLikeComment,
    postComment,
  };
}
