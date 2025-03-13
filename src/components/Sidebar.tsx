
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import { Home, Search, MessageSquare, Bell, User, Trophy, LogOut, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { UserPostsList } from "./post/UserPostsList";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Sidebar() {
  const { user, signOut, projectName } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  
  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name?.substring(0, 1)?.toUpperCase() || "U";
  };

  const menuItems = [
    { path: "/", label: "Página inicial", icon: Home },
    { path: "/profile", label: "Perfil", icon: User },
    { path: "/search", label: "Pesquisar", icon: Search },
    { path: "/messages", label: "Mensagens", icon: MessageSquare },
    { path: "/notifications", label: "Notificações", icon: Bell },
    { path: "/achievements", label: "Conquistas", icon: Trophy },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  // Fetch saved posts
  const fetchSavedPosts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Get saved post IDs from localStorage
      const savedPostsKey = `user_saved_posts_${user.id}`;
      const savedPostsIds = localStorage.getItem(savedPostsKey);
      
      if (!savedPostsIds) {
        setSavedPosts([]);
        setIsLoading(false);
        return;
      }
      
      const parsedSavedPostsIds = JSON.parse(savedPostsIds);
      const savedPostIdsArray = Object.keys(parsedSavedPostsIds).filter(id => parsedSavedPostsIds[id]);
      
      if (savedPostIdsArray.length === 0) {
        setSavedPosts([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch posts from Supabase
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .in('id', savedPostIdsArray)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform posts to match our format
      const transformedPosts = data.map(post => ({
        id: post.id,
        content: post.content,
        timestamp: post.created_at,
        imageUrl: post.image_url,
        likes: post.likes,
        saves: post.saves,
        shares: post.shares,
        user_id: post.user_id,
        author: "Usuário", // This would be fetched from profiles in a real implementation
        date: new Date(post.created_at).toLocaleDateString('pt-BR')
      }));
      
      setSavedPosts(transformedPosts);
      
      // Set liked and saved states
      const likedKey = `user_liked_posts_${user.id}`;
      const savedKey = `user_saved_posts_${user.id}`;
      const storedLiked = localStorage.getItem(likedKey);
      const storedSaved = localStorage.getItem(savedKey);
      
      if (storedLiked) setLiked(JSON.parse(storedLiked));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast({
        title: "Erro ao carregar publicações salvas",
        description: "Não foi possível carregar suas publicações salvas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle like action
  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const newLiked = { ...liked, [postId]: !liked[postId] };
    setLiked(newLiked);
    localStorage.setItem(`user_liked_posts_${user.id}`, JSON.stringify(newLiked));
    
    // Update post likes in Supabase
    const post = savedPosts.find(p => p.id === postId);
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
      const updatedPosts = savedPosts.map(post => {
        if (post.id === postId) {
          return { ...post, likes: newLikesCount };
        }
        return post;
      });
      
      setSavedPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Erro ao atualizar curtidas",
        description: "Não foi possível registrar sua curtida. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Handle save action
  const handleSave = async (postId: string) => {
    if (!user) return;
    
    const newSaved = { ...saved, [postId]: !saved[postId] };
    setSaved(newSaved);
    localStorage.setItem(`user_saved_posts_${user.id}`, JSON.stringify(newSaved));
    
    // Update post saves in Supabase
    const post = savedPosts.find(p => p.id === postId);
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
      
      // Update local state and remove from saved posts if unsaved
      if (saved[postId]) {
        setSavedPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        const updatedPosts = savedPosts.map(post => {
          if (post.id === postId) {
            return { ...post, saves: newSavesCount };
          }
          return post;
        });
        setSavedPosts(updatedPosts);
      }
      
      toast({
        title: saved[postId] ? "Artigo removido" : "Artigo salvo",
        description: saved[postId] 
          ? "O artigo foi removido dos seus salvos" 
          : "O artigo foi salvo e você pode acessá-lo depois",
      });
    } catch (error) {
      console.error("Error updating saves:", error);
      toast({
        title: "Erro ao salvar publicação",
        description: "Não foi possível salvar esta publicação. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Handle share action
  const handleShare = async (postId: string) => {
    // In a real app, this would open the share dialog
    // For now, let's just show a toast
    toast({
      title: "Compartilhar a partir do menu",
      description: "Para compartilhar, use a opção no feed principal.",
    });
  };
  
  // Add Saved Posts button
  const savedPostsCount = Object.values(saved).filter(Boolean).length;

  return (
    <div className={cn(
      "h-screen border-r border-gray-200 bg-white transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="p-4 border-b border-gray-200">
        <h1 className={cn(
          "text-xl font-bold transition-opacity duration-300",
          collapsed ? "opacity-0 h-0" : "opacity-100"
        )}>
          {projectName}
        </h1>
        <button 
          onClick={toggleSidebar} 
          className={cn(
            "mt-2 text-blue-600 hover:text-blue-800",
            collapsed ? "mx-auto block" : ""
          )}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                  isActive && "font-medium text-blue-600 bg-blue-50 hover:bg-blue-100",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
          
          {/* Saved Posts Button */}
          <li>
            <DrawerTrigger asChild onClick={() => {
              setShowSavedDrawer(true);
              fetchSavedPosts();
            }}>
              <button className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                collapsed && "justify-center"
              )}>
                <Bookmark className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && (
                  <span>Publicações salvas {savedPostsCount > 0 && `(${savedPostsCount})`}</span>
                )}
              </button>
            </DrawerTrigger>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className={cn(
            "flex items-center gap-2", 
            collapsed ? "hidden" : "flex"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{getInitials(user?.user_metadata?.name || "")}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user?.user_metadata?.name || "Usuário"}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={signOut} 
            className="text-gray-500 hover:text-red-600"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Saved Posts Drawer */}
      <Drawer open={showSavedDrawer} onOpenChange={setShowSavedDrawer}>
        <DrawerContent className="max-h-[80vh] overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Publicações Salvas</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : savedPosts.length > 0 ? (
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
    </div>
  );
}
