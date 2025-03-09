
import { DEMO_ACHIEVEMENTS } from "@/types/profile";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AchievementsSummary } from "@/components/achievements/AchievementsSummary";
import { AchievementsList } from "@/components/achievements/AchievementsList";
import { WeeklyMissions } from "@/components/achievements/WeeklyMissions";
import { MonthlyRanking } from "@/components/achievements/MonthlyRanking";

const AchievementsPage = () => {
  // For demo purposes, we'll use DEMO_ACHIEVEMENTS
  const achievements = DEMO_ACHIEVEMENTS;
  const completedAchievements = achievements.filter(a => a.completed);
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProfileHeader />
      
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
    </div>
  );
};

export default AchievementsPage;
