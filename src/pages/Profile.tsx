
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Navigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, BarChart3, Edit3, Plus, MessageSquare } from "lucide-react";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import { Achievements } from "@/components/Achievements";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Post } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChatDrawer } from "@/components/chat/ChatDrawer";

const Profile = () => {
  const { user, signOut, deleteAccount, loading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Post interactions using our custom hook
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost,
    handleDeletePost 
  } = useProfilePostInteractions(user);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      setIsSigningOut(false);
    }
  };

  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };

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

  // Load achievements on mount and when user changes
  useEffect(() => {
    if (user) {
      const userAchievements = AchievementsManager.getUserAchievements(user.id);
      setAchievements(userAchievements);

      // Store user name for achievement popups
      if (user.user_metadata?.name) {
        localStorage.setItem(`user_name_${user.id}`, user.user_metadata.name);
      }

      // Check for profile achievement
      const profileAchievement = AchievementsManager.checkProfileCompleted(user);
      if (profileAchievement) {
        setAchievementUnlocked(profileAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }

      // Check for connections achievement
      const connectionsAchievement = AchievementsManager.checkConnectionsAchievement(user.id);
      if (connectionsAchievement) {
        setAchievementUnlocked(connectionsAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }
      
      // Fetch user posts
      fetchUserPosts();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Mensagens</span>
        </Button>
      </div>
      
      {/* Novo estilo de perfil inspirado no LinkedIn */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-blue-50 to-indigo-100 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Editar capa
          </Button>
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row">
            <div className="relative -top-16 mb-2 sm:-top-16 sm:mb-0 sm:mr-4">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-blue-500">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sm:pt-4 sm:flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="-mt-12 sm:mt-0">
                  <h2 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h2>
                  {user?.user_metadata?.professional_description && (
                    <p className="text-gray-600 mt-1">{user.user_metadata.professional_description}</p>
                  )}
                  <p className="text-gray-500 mt-1">
                    {user?.user_metadata?.engineering_type || "Engenharia"} • {" "}
                    <button className="text-blue-600 hover:underline">Informações de contato</button>
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar seção
                  </Button>
                  {!isEditingProfile ? (
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar perfil
                    </Button>
                  ) : null}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">4 visualizações do perfil</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{userPosts.length} publicações</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto">
          <TabsTrigger value="posts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Publicações
          </TabsTrigger>
          <TabsTrigger value="info" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Informações
          </TabsTrigger>
          <TabsTrigger value="achievements" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Conquistas
          </TabsTrigger>
          <TabsTrigger value="account" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Conta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="pt-4">
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
        </TabsContent>
        
        <TabsContent value="info" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Seus dados profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <ProfileForm 
                  user={user} 
                  setIsEditingProfile={setIsEditingProfile}
                  onAchievementUnlocked={(achievement) => {
                    setAchievementUnlocked(achievement);
                    setShowAchievementPopup(true);
                    setAchievements(AchievementsManager.getUserAchievements(user.id));
                  }}
                />
              ) : (
                <ProfileInfo user={user} setIsEditingProfile={setIsEditingProfile} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="pt-4">
          <Achievements achievements={achievements} />
        </TabsContent>
        
        <TabsContent value="account" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Minha Conta</CardTitle>
                  <CardDescription>Gerencie suas informações de conta</CardDescription>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Saindo..." : "Sair"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Email</h3>
                  <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Idioma do perfil</h3>
                  <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
                    Português
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Perfil público e URL</h3>
                  <div className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 flex justify-between items-center">
                    <span className="text-blue-600">
                      {user?.user_metadata?.username ? 
                        `app.engenhariaconecta.com.br/${user.user_metadata.username}` : 
                        "Defina um nome de usuário para ter uma URL personalizada"}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <DeleteAccountDialog deleteAccount={deleteAccount} />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Popup */}
      {achievementUnlocked && showAchievementPopup && (
        <AchievementPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)}
          userName={user.user_metadata?.name || ""}
          achievementTitle={achievementUnlocked.title}
          onShare={handleShareAchievement}
        />
      )}
      
      {/* Chat Drawer Component */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userId={user.id} />
    </div>
  );
};

export default Profile;
