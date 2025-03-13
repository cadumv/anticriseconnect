
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export const useFeedPosts = (user: User | null) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform Supabase posts to match our Post interface
      const transformedPosts = data.map(post => ({
        id: post.id,
        content: post.content,
        timestamp: post.created_at,
        imageUrl: post.image_url,
        likes: post.likes,
        saves: post.saves,
        shares: post.shares,
        user_id: post.user_id,
        author: "Usuário", // Default, we'll fetch this from profiles in a more complete implementation
        date: new Date(post.created_at).toLocaleDateString('pt-BR')
      }));
      
      setUserPosts(transformedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Erro ao carregar publicações",
        description: "Não foi possível carregar as publicações. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSavedPosts = () => {
    if (!user) return;
    
    const savedPostsKey = `user_saved_posts_${user.id}`;
    const savedPostsIds = localStorage.getItem(savedPostsKey);
    
    if (!savedPostsIds) return;
    
    const parsedSavedPostsIds = JSON.parse(savedPostsIds);
    const savedPostsList = userPosts.filter(post => parsedSavedPostsIds[post.id]);
    
    setSavedPosts(savedPostsList);
  };
  
  useEffect(() => {
    fetchPosts();
    
    if (user) {
      const likedKey = `user_liked_posts_${user.id}`;
      const savedKey = `user_saved_posts_${user.id}`;
      const storedLiked = localStorage.getItem(likedKey);
      const storedSaved = localStorage.getItem(savedKey);
      
      if (storedLiked) setLiked(JSON.parse(storedLiked));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
      
      // Setup real-time subscription to posts
      const postsSubscription = supabase
        .channel('posts-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts' },
          (payload) => {
            // Refresh posts when there's a change
            fetchPosts();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(postsSubscription);
      };
    }
  }, [user]);
  
  // Update saved posts when saved state changes
  useEffect(() => {
    fetchSavedPosts();
  }, [saved, userPosts]);

  return {
    userPosts,
    savedPosts,
    liked,
    saved,
    isLoading,
    setLiked,
    setSaved,
    fetchPosts,
    fetchSavedPosts
  };
};
