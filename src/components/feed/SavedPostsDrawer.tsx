
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Post } from "@/types/post";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface SavedPostsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  savedPosts?: Post[];
  userName?: string;
  liked?: Record<string, boolean>;
  saved?: Record<string, boolean>;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function SavedPostsDrawer({
  open,
  onOpenChange,
  user,
  savedPosts: propsSavedPosts,
  userName: propsUserName,
  liked: propsLiked,
  saved: propsSaved,
  onLike: propsOnLike,
  onSave: propsOnSave,
  onShare: propsOnShare
}: SavedPostsDrawerProps) {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  
  // Use provided props if available, otherwise fetch data
  useEffect(() => {
    if (propsSavedPosts) {
      setSavedPosts(propsSavedPosts);
    } else if (open && user) {
      fetchSavedPosts();
    }
    
    if (propsLiked) {
      setLiked(propsLiked);
    }
    
    if (propsSaved) {
      setSaved(propsSaved);
    }
  }, [open, user, propsSavedPosts, propsLiked, propsSaved]);
  
  // Fetch saved posts
  const fetchSavedPosts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Get saved post IDs from localStorage
      const savedPostsKey = `user_saved_posts_${user.id}`;
      const savedPostsIds = localStorage.getItem(savedPostsKey);
      
      if (!savedPostsIds) {
        setSavedPosts([]);
        setIsLoading(false);
        return;
      }
      
      const parsedSavedPostsIds = JSON.parse(savedPostsIds);
      const savedPostIdsArray = Object.keys(parsedSavedPostsIds).filter(id => parsedSavedPostsIds[id]);
      
      if (savedPostIdsArray.length === 0) {
        setSavedPosts([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch posts from Supabase
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .in('id', savedPostIdsArray)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform posts to match our format
      const transformedPosts = data.map(post => ({
        id: post.id,
        content: post.content,
        timestamp: post.created_at,
        imageUrl: post.image_url,
        likes: post.likes,
        saves: post.saves,
        shares: post.shares,
        user_id: post.user_id,
        author: "Usuário", // This would be fetched from profiles in a real implementation
        date: new Date(post.created_at).toLocaleDateString('pt-BR')
      }));
      
      setSavedPosts(transformedPosts);
      
      // Set liked and saved states
      const likedKey = `user_liked_posts_${user.id}`;
      const savedKey = `user_saved_posts_${user.id}`;
      const storedLiked = localStorage.getItem(likedKey);
      const storedSaved = localStorage.getItem(savedKey);
      
      if (storedLiked) setLiked(JSON.parse(storedLiked));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast({
        title: "Erro ao carregar publicações salvas",
        description: "Não foi possível carregar suas publicações salvas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle like action
  const handleLike = async (postId: string) => {
    if (propsOnLike) {
      propsOnLike(postId);
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
        .match({ id: postId });
      
      if (error) throw error;
      
      // Update local state
      const updatedPosts = savedPosts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: newLikesCount };
        }
        return post;
      });
      
      setSavedPosts(updatedPosts);
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
    if (propsOnSave) {
      propsOnSave(postId);
      return;
    }
    
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    // Update post saves in Supabase
    const post = savedPosts.find(p => p.id === postId);
    if (!post) return;
    
    const newSavesCount = saved[postId] 
      ? Math.max(0, (post.saves || 0) - 1) 
      : (post.saves || 0) + 1;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ saves: newSavesCount })
        .match({ id: postId });
      
      if (error) throw error;
      
      // Update local state and remove from saved posts if unsaved
      if (saved[postId]) {
        setSavedPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        const updatedPosts = savedPosts.map(post => {
          if (post.id === postId) {
            return { ...post, saves: newSavesCount };
          }
          return post;
        });
        setSavedPosts(updatedPosts);
      }
      
      toast({
        title: saved[postId] ? "Artigo removido" : "Artigo salvo",
        description: saved[postId] 
          ? "O artigo foi removido dos seus salvos" 
          : "O artigo foi salvo e você pode acessá-lo depois",
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
  
  // Handle share action
  const handleShare = (postId: string) => {
    if (propsOnShare) {
      propsOnShare(postId);
      return;
    }
    
    // In a real app, this would open the share dialog
    // For now, let's just show a toast
    toast({
      title: "Compartilhar a partir do menu",
      description: "Para compartilhar, use a opção no feed principal.",
    });
  };

  const displaySavedPosts = propsSavedPosts || savedPosts;
  const displayUserName = propsUserName || (user?.user_metadata?.name || "Usuário");
  const displayLiked = propsLiked || liked;
  const displaySaved = propsSaved || saved;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] overflow-y-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle>Publicações Salvas</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : displaySavedPosts.length > 0 ? (
            <UserPostsList 
              posts={displaySavedPosts}
              userName={displayUserName}
              liked={displayLiked}
              saved={displaySaved}
              onLike={propsOnLike || handleLike}
              onSave={propsOnSave || handleSave}
              onShare={propsOnShare || handleShare}
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Você ainda não salvou nenhuma publicação.</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
