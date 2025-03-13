
import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { User } from "@supabase/supabase-js";
import { fetchPostsFromSupabase, subscribeToPostsChanges } from "@/services/posts/postService";
import { loadPostInteractionStates, getSavedPosts } from "@/services/posts/postStorageService";
import { supabase } from "@/integrations/supabase/client";

export const useFeedPosts = (user: User | null) => {
  // Posts state
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // User interactions state
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  // Fetch posts from the database
  const fetchPosts = async () => {
    setIsLoading(true);
    const posts = await fetchPostsFromSupabase();
    setUserPosts(posts);
    setIsLoading(false);
    
    // Update saved posts after fetching all posts
    if (user) {
      const savedPostsList = getSavedPosts(user.id, posts);
      setSavedPosts(savedPostsList);
    }
  };
  
  // Update saved posts when saved state or user posts change
  const fetchSavedPosts = () => {
    if (!user) return;
    const savedPostsList = getSavedPosts(user.id, userPosts);
    setSavedPosts(savedPostsList);
  };
  
  // Initial data loading and subscription setup
  useEffect(() => {
    fetchPosts();
    
    if (user) {
      // Load interaction states
      const interactionStates = loadPostInteractionStates(user.id);
      setLiked(interactionStates.liked);
      setSaved(interactionStates.saved);
      
      // Setup real-time subscription to posts
      const postsSubscription = subscribeToPostsChanges(fetchPosts);
      
      return () => {
        supabase.removeChannel(postsSubscription);
      };
    }
  }, [user]);
  
  // Update saved posts when saved state or user posts change
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
