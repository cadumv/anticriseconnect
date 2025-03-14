
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export function useSavedPostInteractions(
  user: User | null | undefined,
  savedPosts: Post[],
  liked: Record<string, boolean>,
  saved: Record<string, boolean>,
  setLiked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setSaved: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  fetchSavedPosts: () => void,
  externalHandlers?: {
    onLike?: (postId: string) => void;
    onSave?: (postId: string) => void;
    onShare?: (postId: string) => void;
  }
) {
  // Handle like action
  const handleLike = async (postId: string) => {
    if (externalHandlers?.onLike) {
      externalHandlers.onLike(postId);
      return;
    }
    
    if (!user) return;
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    // Update post likes in Supabase
    const post = savedPosts.find(p => p.id === postId);
    if (!post) return;
    
    const newLikesCount = liked[postId] 
      ? Math.max(0, (post.likes || 0) - 1) 
      : (post.likes || 0) + 1;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikesCount })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state
      const updatedPosts = savedPosts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: newLikesCount };
        }
        return post;
      });
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Erro ao atualizar curtidas",
        description: "Não foi possível registrar sua curtida. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Handle save action
  const handleSave = async (postId: string) => {
    if (externalHandlers?.onSave) {
      externalHandlers.onSave(postId);
      return;
    }
    
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    try {
      // Find the post in savedPosts or in another source
      const post = savedPosts.find(p => p.id === postId);
      
      if (post) {
        const newSavesCount = saved[postId] 
          ? Math.max(0, (post.saves || 0) - 1) 
          : (post.saves || 0) + 1;
        
        const { error } = await supabase
          .from('posts')
          .update({ saves: newSavesCount })
          .eq('id', postId);
        
        if (error) throw error;
      }
      
      // Show a success toast
      toast({
        title: saved[postId] ? "Artigo removido" : "Artigo salvo",
        description: saved[postId] 
          ? "O artigo foi removido dos seus salvos" 
          : "O artigo foi salvo e você pode acessá-lo depois",
      });
      
      // Update savedPosts list
      fetchSavedPosts();
      
    } catch (error) {
      console.error("Error updating saves:", error);
      toast({
        title: "Erro ao salvar publicação",
        description: "Não foi possível salvar esta publicação. Tente novamente.",
        variant: "destructive",
      });
      
      // Revert the local change in case of error
      setSaved(saved);
      if (user) {
        localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(saved));
      }
    }
  };
  
  // Handle share action
  const handleShare = (postId: string) => {
    if (externalHandlers?.onShare) {
      externalHandlers.onShare(postId);
      return;
    }
    
    // In a real app, this would open the share dialog
    // For now, let's just show a toast
    toast({
      title: "Compartilhar a partir do menu",
      description: "Para compartilhar, use a opção no feed principal.",
    });
  };

  return {
    handleLike,
    handleSave,
    handleShare
  };
}
