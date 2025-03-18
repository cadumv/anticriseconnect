
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches posts from the Supabase database
 */
export const fetchPostsFromSupabase = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform Supabase posts to match our Post interface
    return data.map(post => {
      // Extract metadata
      const metadata = post.metadata || {};
      
      return {
        id: post.id,
        content: post.content,
        timestamp: post.created_at,
        imageUrl: post.image_url,
        likes: post.likes,
        saves: post.saves,
        shares: post.shares,
        user_id: post.user_id,
        metadata: post.metadata,
        // Add metadata fields as direct properties for backward compatibility
        type: metadata.type || 'post',
        title: metadata.title,
        author: metadata.author || "Usuário",
        company: metadata.company,
        summary: metadata.summary,
        mainContent: metadata.mainContent,
        conclusions: metadata.conclusions,
        tags: metadata.tags,
        date: new Date(post.created_at).toLocaleDateString('pt-BR')
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    toast({
      title: "Erro ao carregar publicações",
      description: "Não foi possível carregar as publicações. Tente novamente mais tarde.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Subscribes to real-time changes in the posts table
 */
export const subscribeToPostsChanges = (callback: () => void) => {
  const postsSubscription = supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      () => {
        callback();
      }
    )
    .subscribe();
    
  return postsSubscription;
};
