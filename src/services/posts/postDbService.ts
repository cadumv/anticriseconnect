
import { supabase } from "@/lib/supabase";

interface PostData {
  content: string;
  image_url?: string | null;
  user_id: string;
  metadata: any;
}

/**
 * Creates a post in Supabase
 */
export const createPostInDb = async (postData: PostData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

/**
 * Caches post in localStorage for quicker access
 */
export const cachePostInLocalStorage = (userId: string, postData: any) => {
  const postsKey = `user_posts_${userId}`;
  const savedPosts = localStorage.getItem(postsKey);
  const posts = savedPosts ? JSON.parse(savedPosts) : [];
  posts.unshift(postData);
  localStorage.setItem(postsKey, JSON.stringify(posts));
};
