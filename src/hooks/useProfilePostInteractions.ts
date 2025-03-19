
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { loadPostInteractionStates } from "@/services/posts/postStorageService";

export const useProfilePostInteractions = (user: User | null) => {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  // Load liked/saved states from localStorage on mount
  useEffect(() => {
    if (user) {
      const { liked: storedLiked, saved: storedSaved } = loadPostInteractionStates(user.id);
      setLiked(storedLiked);
      setSaved(storedSaved);
    }
  }, [user]);

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    try {
      // First get the current likes count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentLikes = post?.likes || 0;
      const newLikesCount = liked[postId] 
        ? Math.max(0, currentLikes - 1) 
        : currentLikes + 1;
      
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikesCount })
        .eq('id', postId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Erro ao atualizar curtidas",
        description: "Não foi possível registrar sua curtida. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleSavePost = async (postId: string) => {
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    try {
      // First get the current saves count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('saves')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentSaves = post?.saves || 0;
      const newSavesCount = saved[postId] 
        ? Math.max(0, currentSaves - 1) 
        : currentSaves + 1;
      
      const { error } = await supabase
        .from('posts')
        .update({ saves: newSavesCount })
        .eq('id', postId);
      
      if (error) throw error;
      
      toast({
        title: saved[postId] ? "Artigo removido" : "Artigo salvo",
        description: saved[postId] 
          ? "O artigo foi removido dos seus salvos" 
          : "O artigo foi salvo e você pode acessá-lo depois",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating saves:", error);
      toast({
        title: "Erro ao salvar publicação",
        description: "Não foi possível salvar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleSharePost = async (postId: string) => {
    try {
      // Just return the postId for the ShareDialog component to handle
      return postId;
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar esta publicação. Tente novamente.",
        variant: "destructive",
      });
      return postId;
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Publicação excluída",
        description: "Sua publicação foi excluída com sucesso",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Erro ao excluir publicação",
        description: "Não foi possível excluir sua publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    liked,
    saved,
    handleLikePost,
    handleSavePost,
    handleSharePost,
    handleDeletePost
  };
};
