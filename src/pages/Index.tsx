
import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Feed } from "@/components/Feed";
import { Discovery } from "@/components/Discovery";
import { PartnershipRequests } from "@/components/PartnershipRequests";
import { useAuth } from "@/hooks/useAuth";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import { AchievementsSidebar } from "@/components/achievements/AchievementsSidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Index = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  // Load user achievements when component mounts or user changes
  useEffect(() => {
    console.log("Current ID param:", user?.id);
    
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

      // Check for connections achievement if profile achievement wasn't unlocked
      if (!profileAchievement) {
        const connectionsAchievement = AchievementsManager.checkConnectionsAchievement(user.id);
        if (connectionsAchievement) {
          setAchievementUnlocked(connectionsAchievement);
          setShowAchievementPopup(true);
          // Update achievements list immediately
          setAchievements(AchievementsManager.getUserAchievements(user.id));
        }
        // Check for first publication achievement if no other achievements were unlocked
        else {
          const publicationAchievement = AchievementsManager.checkFirstPublicationAchievement(user.id);
          if (publicationAchievement) {
            setAchievementUnlocked(publicationAchievement);
            setShowAchievementPopup(true);
            // Update achievements list immediately
            setAchievements(AchievementsManager.getUserAchievements(user.id));
          }
          // Check for technical article achievement
          else {
            const technicalArticleAchievement = AchievementsManager.checkTechnicalArticleAchievement(user.id);
            if (technicalArticleAchievement) {
              setAchievementUnlocked(technicalArticleAchievement);
              setShowAchievementPopup(true);
              // Update achievements list immediately
              setAchievements(AchievementsManager.getUserAchievements(user.id));
            }
          }
        }
      }
    }
  }, [user]);

  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };

  // Calculate total achievement points
  const totalPoints = achievements
    .filter(a => a.completed)
    .reduce((sum, achievement) => sum + achievement.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-8">
            <ProfileHeader />
            <Feed />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-4 space-y-8">
              <AchievementsSidebar 
                achievements={achievements}
                totalPoints={totalPoints}
              />
              <PartnershipRequests />
              <Discovery />
            </div>
          </div>
        </div>
      </main>

      {/* Achievement Popup */}
      <Dialog open={showAchievementPopup} onOpenChange={setShowAchievementPopup}>
        <DialogContent className="p-0 border-none bg-transparent" forceMount>
          {achievementUnlocked && (
            <AchievementPopup
              isOpen={showAchievementPopup}
              onClose={() => setShowAchievementPopup(false)}
              userName={user?.user_metadata?.name || ""}
              achievementTitle={achievementUnlocked.title}
              onShare={handleShareAchievement}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
