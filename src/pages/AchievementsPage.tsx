
import { useState } from "react";
import { DEMO_ACHIEVEMENTS } from "@/types/profile";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AchievementsSummary } from "@/components/achievements/AchievementsSummary";
import { AchievementsList } from "@/components/achievements/AchievementsList";
import { WeeklyMissions } from "@/components/achievements/WeeklyMissions";
import { MonthlyRanking } from "@/components/achievements/MonthlyRanking";
import { AchievementsDialog } from "@/components/AchievementsDialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AchievementsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // For demo purposes, we'll use DEMO_ACHIEVEMENTS
  const achievements = DEMO_ACHIEVEMENTS;
  const completedAchievements = achievements.filter(a => a.completed);
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProfileHeader />
      
      {/* Achievements Button with Dialog */}
      <div className="flex justify-center mb-4">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="gap-2"
        >
          Ver Todas as Conquistas <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Summary Card */}
      <AchievementsSummary 
        totalPoints={totalPoints} 
        completedCount={completedAchievements.length} 
      />
      
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
    </div>
  );
};

export default AchievementsPage;
