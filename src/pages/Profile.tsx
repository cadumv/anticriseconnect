
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Navigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import { Achievements } from "@/components/Achievements";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Post } from "@/types/post";
import { supabase } from "@/lib/supabase";
import { usePostInteractions } from "@/hooks/usePostInteractions";

const Profile = () => {
  const { user, signOut, deleteAccount, loading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  
  // Post interactions
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost,
    handleDeletePost 
  } = usePostInteractions();

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

  // Loading and auth states
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>
      
      <ProfileHeader />
      
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
          {isEditingProfile ? (
            <ProfileForm 
              user={user} 
              setIsEditingProfile={setIsEditingProfile}
              onAchievementUnlocked={(achievement) => {
                setAchievementUnlocked(achievement);
                setShowAchievementPopup(true);
                // Update achievements list when a new one is unlocked
                setAchievements(AchievementsManager.getUserAchievements(user.id));
              }}
            />
          ) : (
            <ProfileInfo user={user} setIsEditingProfile={setIsEditingProfile} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <DeleteAccountDialog deleteAccount={deleteAccount} />
        </CardFooter>
      </Card>

      {/* User Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Publicações</CardTitle>
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

      {/* Achievements component */}
      <Achievements achievements={achievements} />

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
    </div>
  );
};

export default Profile;
