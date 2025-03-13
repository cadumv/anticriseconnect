
import { Post } from "@/types/post";

interface PostInteractionState {
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
}

/**
 * Loads user post interaction states from localStorage
 */
export const loadPostInteractionStates = (userId: string): PostInteractionState => {
  const likedKey = `user_liked_posts_${userId}`;
  const savedKey = `user_saved_posts_${userId}`;
  const storedLiked = localStorage.getItem(likedKey);
  const storedSaved = localStorage.getItem(savedKey);
  
  return {
    liked: storedLiked ? JSON.parse(storedLiked) : {},
    saved: storedSaved ? JSON.parse(storedSaved) : {}
  };
};

/**
 * Gets saved posts based on user's saved state and available posts
 */
export const getSavedPosts = (
  userId: string | undefined, 
  allPosts: Post[]
): Post[] => {
  if (!userId) return [];
  
  const savedPostsKey = `user_saved_posts_${userId}`;
  const savedPostsIds = localStorage.getItem(savedPostsKey);
  
  if (!savedPostsIds) return [];
  
  const parsedSavedPostsIds = JSON.parse(savedPostsIds);
  return allPosts.filter(post => parsedSavedPostsIds[post.id]);
};
