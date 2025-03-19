
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Achievement } from "@/types/profile";
import { AchievementsManager } from "@/services/AchievementsManager";
import { ProfileHeader } from "./ProfilePageHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { ProfileNavbar } from "./sections/ProfileNavbar";
import { ProfileAnalytics } from "./sections/ProfileAnalytics";
import { ProfileAbout } from "./sections/ProfileAbout";
import { ProfileActivities } from "./sections/ProfileActivities";
import { ProfileExperience } from "./sections/ProfileExperience";
import { ProfileEducation } from "./sections/ProfileEducation";
import { AchievementPopupWrapper } from "./sections/AchievementPopupWrapper";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
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
      <ProfileNavbar onOpenChat={() => setIsChatOpen(!isChatOpen)} />
      <ProfileHeader user={user} />
      <ProfileAnalytics />
      <ProfileAbout user={user} />
      <ProfileActivities />
      <ProfileExperience user={user} />
      <ProfileEducation user={user} />
      
      <ProfileTabs 
        user={user} 
        achievements={achievements}
        onAchievementUnlocked={(achievement) => {
          setAchievementUnlocked(achievement);
          setShowAchievementPopup(true);
          setAchievements(AchievementsManager.getUserAchievements(user.id));
        }}
      />

      <AchievementPopupWrapper
        showAchievementPopup={showAchievementPopup}
        achievementUnlocked={achievementUnlocked}
        userName={user.user_metadata?.name || ""}
        onClose={() => setShowAchievementPopup(false)}
        onShare={handleShareAchievement}
      />
      
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userId={user.id} />
    </div>
  );
};

export default ProfilePage;
