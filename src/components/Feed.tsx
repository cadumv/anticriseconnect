
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { NewPostDialog } from "./NewPostDialog";
import { toast } from "@/hooks/use-toast";
import { UserPostsList } from "./post/UserPostsList";
import { DefaultPostsList } from "./post/DefaultPostsList";
import { supabase } from "@/integrations/supabase/client";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { ShareDialog } from "./ShareDialog";

interface Post {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
  type?: 'achievement' | 'post' | 'service' | 'technical_article';
  achievementId?: string;
  timestamp: string;
  imageUrl?: string;
  summary?: string;
  conclusions?: string;
  mainContent?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
  user_id?: string;
}

export const Feed = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string>("");
  
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
  
  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    // Update post likes in Supabase
    const post = userPosts.find(p => p.id === postId);
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
      const updatedPosts = userPosts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: newLikesCount };
        }
        return post;
      });
      
      setUserPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Erro ao atualizar curtidas",
        description: "Não foi possível registrar sua curtida. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleSave = async (postId: string) => {
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    // Update post saves in Supabase
    const post = userPosts.find(p => p.id === postId);
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
      
      // Update local state
      const updatedPosts = userPosts.map(post => {
        if (post.id === postId) {
          return { ...post, saves: newSavesCount };
        }
        return post;
      });
      
      setUserPosts(updatedPosts);
      
      toast({
        title: saved[postId] ? "Artigo removido" : "Artigo salvo",
        description: saved[postId] 
          ? "O artigo foi removido dos seus salvos" 
          : "O artigo foi salvo e você pode acessá-lo depois",
      });
      
      // Update the saved posts list
      fetchSavedPosts();
    } catch (error) {
      console.error("Error updating saves:", error);
      toast({
        title: "Erro ao salvar publicação",
        description: "Não foi possível salvar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async (postId: string) => {
    setCurrentPostId(postId);
    setShareDialogOpen(true);
  };
  
  const completeShareAction = async (userIds: string[]) => {
    if (!user) return;
    
    // Update post shares in Supabase
    const post = userPosts.find(p => p.id === currentPostId);
    if (!post) return;
    
    const newSharesCount = (post.shares || 0) + 1;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ shares: newSharesCount })
        .match({ id: currentPostId });
      
      if (error) throw error;
      
      // Update local state
      const updatedPosts = userPosts.map(post => {
        if (post.id === currentPostId) {
          return { ...post, shares: newSharesCount };
        }
        return post;
      });
      
      setUserPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating shares:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Feed de publicações</CardTitle>
          <div className="flex items-center gap-2">
            {user && savedPosts.length > 0 && (
              <DrawerTrigger asChild onClick={() => setShowSavedDrawer(true)}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bookmark size={16} />
                  <span>Salvos ({savedPosts.length})</span>
                </Button>
              </DrawerTrigger>
            )}
            {user && <NewPostDialog onPostCreated={fetchPosts} />}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <UserPostsList 
                posts={userPosts}
                userName={user?.user_metadata?.name || "Usuário"}
                liked={liked}
                saved={saved}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
              />
              
              {userPosts.length === 0 && (
                <DefaultPostsList 
                  posts={[]} 
                  isLoggedIn={!!user}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Saved Posts Drawer */}
      <Drawer open={showSavedDrawer} onOpenChange={setShowSavedDrawer}>
        <DrawerContent className="max-h-[80vh] overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Publicações Salvas</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {savedPosts.length > 0 ? (
              <UserPostsList 
                posts={savedPosts}
                userName={user?.user_metadata?.name || "Usuário"}
                liked={liked}
                saved={saved}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
              />
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">Você ainda não salvou nenhuma publicação.</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Share Dialog */}
      {shareDialogOpen && (
        <ShareDialog 
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          onShare={completeShareAction}
          postId={currentPostId}
        />
      )}
    </>
  );
};
