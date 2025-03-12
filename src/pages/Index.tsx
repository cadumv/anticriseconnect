
import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Achievements } from "@/components/Achievements";
import { Feed } from "@/components/Feed";
import { Discovery } from "@/components/Discovery";
import { PartnershipRequests } from "@/components/PartnershipRequests";
import { useAuth } from "@/hooks/useAuth";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";

const Index = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  // Load user achievements when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userAchievements = AchievementsManager.getUserAchievements(user.id);
      setAchievements(userAchievements);

      // Check for profile achievement
      const profileAchievement = AchievementsManager.checkProfileCompleted(user);
      if (profileAchievement) {
        setAchievementUnlocked(profileAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }

      // Store user name for later reference
      if (user.user_metadata?.name) {
        localStorage.setItem(`user_name_${user.id}`, user.user_metadata.name);
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

  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-8">
            <ProfileHeader />
            <Achievements achievements={achievements} />
            <Feed />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-4 space-y-8">
              <PartnershipRequests />
              <Discovery />
            </div>
          </div>
        </div>
      </main>

      {/* Achievement Popup */}
      {achievementUnlocked && showAchievementPopup && (
        <AchievementPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)}
          userName={user?.user_metadata?.name || ""}
          achievementTitle={achievementUnlocked.title}
          onShare={handleShareAchievement}
        />
      )}
    </div>
  );
};

export default Index;
