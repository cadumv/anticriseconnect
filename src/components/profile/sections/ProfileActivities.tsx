
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { UserPostsList } from "@/components/post/UserPostsList";

interface ProfileActivitiesProps {
  user: User;
}

export const ProfileActivities = ({ user }: ProfileActivitiesProps) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUserPosts();
  }, [user.id]);
  
  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform data to match Post type
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
          type: metadata.type || 'post',
          metadata: metadata,
          title: metadata.title,
          author: user.user_metadata?.name || "Usuário",
          date: new Date(post.created_at).toLocaleDateString('pt-BR')
        };
      });
      
      setUserPosts(formattedPosts);
      
      // Initialize liked and saved states
      const newLiked: Record<string, boolean> = {};
      const newSaved: Record<string, boolean> = {};
      formattedPosts.forEach(post => {
        newLiked[post.id] = false;
        newSaved[post.id] = false;
      });
      setLiked(newLiked);
      setSaved(newSaved);
      
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast({
        title: "Erro ao carregar publicações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "O conteúdo da publicação não pode estar vazio",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: postContent,
            user_id: user.id,
            metadata: {
              type: 'post',
            }
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Publicação criada com sucesso",
      });
      
      setIsCreatingPost(false);
      setPostContent("");
      fetchUserPosts();
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Erro ao criar publicação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLike = (postId: string) => {
    setLiked(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  const handleSave = (postId: string) => {
    setSaved(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    toast({
      title: saved[postId] ? "Publicação removida dos salvos" : "Publicação salva",
      description: saved[postId] 
        ? "A publicação foi removida dos seus salvos"
        : "A publicação foi salva para visualização posterior",
    });
  };
  
  const handleShare = (postId: string) => {
    toast({
      title: "Função de compartilhamento",
      description: "Esta funcionalidade será implementada em breve.",
    });
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      toast({
        title: "Publicação excluída com sucesso",
      });
      
      // Update local state by removing the deleted post
      setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      return true; // Return true to indicate successful deletion
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "Erro ao excluir publicação",
        description: error.message,
        variant: "destructive",
      });
      return false; // Return false to indicate failed deletion
    }
  };
  
  const handleEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setCurrentPostId(postId);
      setEditPostContent(post.content || "");
      setIsEditingPost(true);
    }
  };
  
  const saveEditedPost = async () => {
    if (!currentPostId || !editPostContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editPostContent })
        .eq('id', currentPostId);
      
      if (error) throw error;
      
      // Update local state
      setUserPosts(prev => prev.map(post => 
        post.id === currentPostId 
          ? { ...post, content: editPostContent }
          : post
      ));
      
      toast({
        title: "Publicação atualizada com sucesso",
      });
      
      setIsEditingPost(false);
      setCurrentPostId(null);
      setEditPostContent("");
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        title: "Erro ao atualizar publicação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Atividades</CardTitle>
        <div className="flex items-center gap-2">
          <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
              >
                Criar publicação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar nova publicação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="O que você gostaria de compartilhar?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingPost(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !postContent.trim()}
                >
                  {isSubmitting ? "Publicando..." : "Publicar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => toast({
              title: "Editar atividades",
              description: "Você pode adicionar novas atividades clicando em 'Criar publicação'.",
            })}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : userPosts.length > 0 ? (
          <UserPostsList 
            posts={userPosts}
            userName={user.user_metadata?.name || "Usuário"}
            liked={liked}
            saved={saved}
            onLike={handleLike}
            onSave={handleSave}
            onShare={handleShare}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            compact={true}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Você ainda não publicou nada<br />
            As publicações que você compartilhar serão exibidas aqui.
          </p>
        )}
        
        {userPosts.length > 0 && (
          <div className="border-t mt-4 pt-2 text-right">
            <Button variant="link" className="text-xs text-blue-600 hover:underline p-0 h-auto">
              Exibir todas as atividades →
            </Button>
          </div>
        )}
        
        {/* Edit Post Dialog */}
        <Dialog open={isEditingPost} onOpenChange={setIsEditingPost}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar publicação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="O que você gostaria de compartilhar?"
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditingPost(false);
                  setCurrentPostId(null);
                  setEditPostContent("");
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={saveEditedPost}
                disabled={isSubmitting || !editPostContent.trim()}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
