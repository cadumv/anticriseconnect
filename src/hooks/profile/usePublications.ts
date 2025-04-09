
import { useState, useEffect } from "react";
import { Publication, DEMO_PUBLICATIONS } from "@/types/profile";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";

interface UsePublicationsReturn {
  publications: Publication[];
  loading: boolean;
}

export const usePublications = (profileId: string | undefined): UsePublicationsReturn => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileId || profileId === ":id") return;

    // Handle demo profile publications
    if (profileId === "demo") {
      setPublications(DEMO_PUBLICATIONS);
      return;
    }

    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        // Fetch posts from the user
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching user publications:", error);
          setLoading(false);
          return;
        }
        
        // Transform posts to publication format
        const transformedPublications: Publication[] = data.map((post) => {
          const metadata = post.metadata || {};
          const content = post.content || "";
          
          // Create a snippet from the content
          const snippet = content.length > 150 
            ? content.substring(0, 150) + "..." 
            : content;
          
          return {
            id: post.id,
            title: metadata.title || "Publicação",
            snippet: snippet,
            date: new Date(post.created_at).toLocaleDateString('pt-BR'),
            url: `/post/${post.id}`
          };
        });
        
        setPublications(transformedPublications);
      } catch (err) {
        console.error("Error processing publications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [profileId]);

  return { publications, loading };
};
