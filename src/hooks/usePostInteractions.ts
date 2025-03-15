
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export const usePostInteractions = (
  user: User | null,
  posts: Post[],
  liked: Record<string, boolean>,
  saved: Record<string, boolean>,
  setLiked: (value: Record<string, boolean>) => void,
  setSaved: (value: Record<string, boolean>) => void,
  fetchSavedPosts: () => void
) => {
  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    // Update post likes in Supabase
    const post = posts.find(p => p.id === postId);
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
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Erro ao atualizar curtidas",
        description: "Não foi possível registrar sua curtida. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleSave = async (postId: string) => {
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    // Find the post in the posts array
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newSavesCount = saved[postId] 
      ? Math.max(0, (post.saves || 0) - 1) 
      : (post.saves || 0) + 1;
    
    try {
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
      
      // Update the saved posts list
      fetchSavedPosts();
    } catch (error) {
      console.error("Error updating saves:", error);
      toast({
        title: "Erro ao salvar publicação",
        description: "Não foi possível salvar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async (postId: string) => {
    // This will be handled in the ShareDialog component
    return postId;
  };
  
  const completeShareAction = async (postId: string, userIds: string[]) => {
    if (!user) return;
    
    // Update post shares in Supabase
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newSharesCount = (post.shares || 0) + 1;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ shares: newSharesCount })
        .eq('id', postId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating shares:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    handleLike,
    handleSave,
    handleShare,
    completeShareAction
  };
};
