
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export function useSavedPosts(
  user: User | null | undefined,
  open: boolean,
  propsSavedPosts?: Post[],
  propsLiked?: Record<string, boolean>,
  propsSaved?: Record<string, boolean>
) {
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
    } else if (user) {
      const likedKey = `user_liked_posts_${user.id}`;
      const storedLiked = localStorage.getItem(likedKey);
      if (storedLiked) setLiked(JSON.parse(storedLiked));
    }
    
    if (propsSaved) {
      setSaved(propsSaved);
    } else if (user) {
      const savedKey = `user_saved_posts_${user.id}`;
      const storedSaved = localStorage.getItem(savedKey);
      if (storedSaved) setSaved(JSON.parse(storedSaved));
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
        .in('id', savedPostIdsArray);
      
      if (error) throw error;
      
      // Transform posts to match our format
      const transformedPosts: Post[] = data.map(post => ({
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
  
  return {
    savedPosts,
    isLoading,
    liked,
    saved,
    setLiked,
    setSaved,
    fetchSavedPosts
  };
}
