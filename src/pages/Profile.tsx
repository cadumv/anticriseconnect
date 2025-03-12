
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

const Profile = () => {
  const { user, signOut, deleteAccount, loading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

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

  useEffect(() => {
    if (user) {
      const achievement = AchievementsManager.checkProfileCompleted(user);
      if (achievement) {
        setAchievementUnlocked(achievement);
        setShowAchievementPopup(true);
      }
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
