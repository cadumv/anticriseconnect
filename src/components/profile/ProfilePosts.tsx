
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Post } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";

interface ProfilePostsProps {
  user: User;
}

export const ProfilePosts = ({ user }: ProfilePostsProps) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  
  // Post interactions using our custom hook
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost,
    handleDeletePost 
  } = useProfilePostInteractions(user);

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user) return;
    
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
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
          author: metadata.author || user.user_metadata?.name || "Usuário",
          date: new Date(post.created_at).toLocaleDateString('pt-BR')
        };
      });
      
      setUserPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Delete post handler
  const onDeletePost = async (postId: string) => {
    if (!user) return;
    
    if (window.confirm("Tem certeza que deseja excluir esta publicação?")) {
      try {
        handleDeletePost(postId);
        
        // Update the local state immediately
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Minhas Publicações</CardTitle>
        <CardDescription>Publicações que você compartilhou</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingPosts ? (
          <div className="text-center py-10">
            <div className="animate-pulse text-lg">Carregando publicações...</div>
          </div>
        ) : userPosts.length > 0 ? (
          <UserPostsList
            posts={userPosts}
            userName={user.user_metadata?.name || "Usuário"}
            liked={liked}
            saved={saved}
            onLike={handleLikePost}
            onSave={handleSavePost}
            onShare={handleSharePost}
            onDelete={onDeletePost}
          />
        ) : (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <p className="text-gray-500 mb-2">Você ainda não fez nenhuma publicação</p>
            <p className="text-sm text-gray-400">As publicações que você compartilhar aparecerão aqui</p>
            <Button className="mt-4" variant="outline" onClick={() => window.location.href = "/"}>
              Ir para o Feed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
