
import { useState, useEffect } from "react";
import { DEMO_ACHIEVEMENTS } from "@/types/profile";
import { AchievementsSummary } from "@/components/achievements/AchievementsSummary";
import { AchievementsList } from "@/components/achievements/AchievementsList";
import { WeeklyMissions } from "@/components/achievements/WeeklyMissions";
import { MonthlyRanking } from "@/components/achievements/MonthlyRanking";
import { AchievementsDialog } from "@/components/AchievementsDialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";

const AchievementsPage = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  
  useEffect(() => {
    if (user) {
      const userAchievements = AchievementsManager.getUserAchievements(user.id);
      setAchievements(userAchievements);

      // Check for connections achievement
      const connectionsAchievement = AchievementsManager.checkConnectionsAchievement(user.id);
      if (connectionsAchievement) {
        setAchievementUnlocked(connectionsAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }
    } else {
      // For demo purposes when not logged in
      setAchievements(DEMO_ACHIEVEMENTS);
    }
  }, [user]);
  
  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };
  
  // Calculate points from actual achievements
  const completedAchievements = achievements.filter(a => a.completed);
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Summary Card */}
      <AchievementsSummary 
        totalPoints={totalPoints} 
        completedCount={completedAchievements.length} 
      />
      
      {/* Achievements Button with Dialog - Moved below the summary card */}
      <div className="flex justify-center mb-4">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="gap-2"
        >
          Ver Todas as Conquistas <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Achievements List */}
      <AchievementsList achievements={achievements} />
      
      {/* Weekly Missions */}
      <WeeklyMissions />
      
      {/* Monthly Ranking */}
      <MonthlyRanking />
      
      {/* Achievements Dialog */}
      <AchievementsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        achievements={achievements}
      />
      
      {/* Achievement Popup */}
      {achievementUnlocked && showAchievementPopup && user && (
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

export default AchievementsPage;
