
import { User } from "@supabase/supabase-js";
import { ProfileData, Publication } from "@/types/profile";
import { Post } from "@/types/post";
import { useProfileData } from "./profile/useProfileData";
import { usePublications } from "./profile/usePublications";
import { useFollowStatus } from "./profile/useFollowStatus";
import { useConnectionStatus } from "./profile/useConnectionStatus";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UsePublicProfileReturn {
  profile: ProfileData | null;
  publications: Publication[];
  publicationLoading: boolean;
  userPosts: Post[];
  postsLoading: boolean;
  loading: boolean;
  error: string;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionAccepted: boolean;
  handleFollowToggle: () => Promise<void>;
}

export const usePublicProfile = (id: string | undefined, user: User | null): UsePublicProfileReturn => {
  const { profile, loading, error } = useProfileData(id, user);
  const { publications, loading: publicationLoading } = usePublications(id);
  const { isFollowing, followLoading, handleFollowToggle } = useFollowStatus(id, user);
  const { isConnectionAccepted } = useConnectionStatus(id, user);
  
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!id || id === ":id") return;
      
      // Handle demo profile
      if (id === "demo") {
        // Set demo posts if needed
        return;
      }
      
      setPostsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }
        
        // Transform posts to match Post interface
        const formattedPosts = data.map(post => {
          const metadata = post.metadata || {};
          
          return {
            id: post.id,
            content: post.content,
            timestamp: post.created_at,
            imageUrl: post.image_url,
            likes: post.likes || 0,
            saves: post.saves || 0,
            shares: post.shares || 0,
            user_id: post.user_id,
            metadata: post.metadata,
            type: metadata.type || 'post',
            title: metadata.title,
            author: profile?.name || "Usuário",
            date: new Date(post.created_at).toLocaleDateString('pt-BR')
          };
        });
        
        setUserPosts(formattedPosts);
      } catch (error) {
        console.error("Error processing user posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };
    
    if (id) {
      fetchUserPosts();
    }
  }, [id, profile]);

  return {
    profile,
    publications,
    publicationLoading,
    userPosts,
    postsLoading,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  };
};
