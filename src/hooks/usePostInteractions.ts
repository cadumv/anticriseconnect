
import { Post } from "@/types/post";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const usePostInteractions = (
  user: User | null,
  posts: Post[],
  liked: Record<string, boolean>,
  saved: Record<string, boolean>,
  setLiked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setSaved: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  fetchSavedPosts: () => void
) => {

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para curtir uma publicação.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update local state immediately for responsive UI
      const newLiked = { ...liked };
      newLiked[postId] = !newLiked[postId];
      setLiked(newLiked);
      
      // Save to localStorage for persistence
      localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
      
      // Get the current post data to update the likes count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new likes count based on the action (like or unlike)
      const currentLikes = post?.likes || 0;
      const newLikesCount = !liked[postId] 
        ? currentLikes + 1  // Adding a like
        : Math.max(0, currentLikes - 1); // Removing a like, ensuring it doesn't go below 0
        
      // Update the post in the database
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikesCount })
        .eq('id', postId);
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Error updating post like status:", error);
      toast({
        title: "Erro ao processar curtida",
        description: "Não foi possível processar sua curtida. Tente novamente.",
        variant: "destructive",
      });
      
      // Revert the local state if the operation failed
      const revertedLiked = { ...liked };
      revertedLiked[postId] = !revertedLiked[postId];
      setLiked(revertedLiked);
    }
  };
  
  const handleSave = async (postId: string) => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para salvar uma publicação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update local state immediately for responsive UI
      const newSaved = { ...saved };
      newSaved[postId] = !newSaved[postId];
      setSaved(newSaved);
      
      // Save to localStorage for persistence
      localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
      
      // Get the current post data to update the saves count
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('saves')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new saves count based on the action (save or unsave)
      const currentSaves = post?.saves || 0;
      const newSavesCount = !saved[postId] 
        ? currentSaves + 1  // Adding a save
        : Math.max(0, currentSaves - 1); // Removing a save, ensuring it doesn't go below 0
        
      // Update the post in the database
      const { error } = await supabase
        .from('posts')
        .update({ saves: newSavesCount })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update the saved posts list
      fetchSavedPosts();
      
      // Show a success message
      toast({
        title: !saved[postId] ? "Publicação salva" : "Publicação removida dos salvos",
        description: !saved[postId] 
          ? "A publicação foi adicionada aos seus itens salvos." 
          : "A publicação foi removida dos seus itens salvos.",
      });
      
    } catch (error) {
      console.error("Error updating post save status:", error);
      toast({
        title: "Erro ao processar salvamento",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
      
      // Revert the local state if the operation failed
      const revertedSaved = { ...saved };
      revertedSaved[postId] = !revertedSaved[postId];
      setSaved(revertedSaved);
    }
  };
  
  const handleShare = (postId: string) => {
    // For now, we'll just return the postId
    // This will be expanded when implementing actual sharing
    return postId;
  };
  
  const handleDelete = async (postId: string) => {
    if (!user) return false;
    
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
      });
      
      return true; // Return true to indicate successful deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Erro ao excluir publicação",
        description: "Não foi possível excluir sua publicação. Tente novamente.",
        variant: "destructive",
      });
      return false; // Return false to indicate failed deletion
    }
  };
  
  const completeShareAction = (postId: string, userIds: string[]) => {
    // This function will be expanded when implementing actual sharing with users
    if (userIds.length > 0) {
      toast({
        title: "Compartilhamento em desenvolvimento",
        description: `Compartilhamento de publicações será implementado em breve.`,
      });
    }
  };

  return {
    handleLike,
    handleSave,
    handleShare,
    handleDelete,
    completeShareAction
  };
};
