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

/**
 * @restricted
 * IMPORTANTE: A formatação e estrutura desta página de conquistas está travada.
 * Não modifique a estrutura, layout ou componentes sem autorização específica.
 * Qualquer alteração só deve ser feita mediante comando direto autorizado.
 */
const AchievementsPage = () => {
  // Safely access useAuth
  const { user } = useAuth();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  
  useEffect(() => {
    try {
      if (user) {
        const userAchievements = AchievementsManager.getUserAchievements(user.id);
        setAchievements(userAchievements);

        // Check if the user has completed the referral mission
        checkReferralMission(user.id);

        // Check for connections achievement
        const connectionsAchievement = AchievementsManager.checkConnectionsAchievement(user.id);
        if (connectionsAchievement) {
          setAchievementUnlocked(connectionsAchievement);
          setShowAchievementPopup(true);
          // Update achievements list immediately
          setAchievements(AchievementsManager.getUserAchievements(user.id));
        }
        
        // Check for first publication achievement
        if (!connectionsAchievement) {
          const publicationAchievement = AchievementsManager.checkFirstPublicationAchievement(user.id);
          if (publicationAchievement) {
            setAchievementUnlocked(publicationAchievement);
            setShowAchievementPopup(true);
            // Update achievements list immediately
            setAchievements(AchievementsManager.getUserAchievements(user.id));
          }
        }
      } else {
        // For demo purposes when not logged in
        setAchievements(DEMO_ACHIEVEMENTS);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
      // Fallback to demo achievements
      setAchievements(DEMO_ACHIEVEMENTS);
    }
  }, [user]);

  const checkReferralMission = (userId: string) => {
    try {
      // Check if the user has completed the referral mission
      const referralsKey = `user_referrals_${userId}`;
      const referralsData = localStorage.getItem(referralsKey);
      
      if (referralsData) {
        const referrals = JSON.parse(referralsData);
        
        // If the user has 10 or more referrals, check if they've already been rewarded
        if (referrals.length >= 10) {
          const achievementId = "referral-achievement";
          const unlockedAchievements = AchievementsManager.getUnlockedAchievements(userId);
          
          if (!unlockedAchievements.includes(achievementId)) {
            // Create the achievement
            const referralAchievement: Achievement = {
              id: achievementId,
              title: "Rede de Engenheiros",
              description: "Convidou 10 engenheiros para a plataforma",
              icon: "share",
              completed: true,
              points: 200,
              category: 'connection'
            };
            
            // Add it to the user's achievements
            const userAchievements = AchievementsManager.getUserAchievements(userId);
            userAchievements.push(referralAchievement);
            AchievementsManager.saveUserAchievements(userId, userAchievements);
            
            // Mark as unlocked
            unlockedAchievements.push(achievementId);
            AchievementsManager.saveUnlockedAchievements(userId, unlockedAchievements);
            
            // Show the achievement popup
            setAchievementUnlocked(referralAchievement);
            setShowAchievementPopup(true);
            
            // Update achievements list immediately
            setAchievements(AchievementsManager.getUserAchievements(userId));
          }
        }
      }
    } catch (error) {
      console.error("Error checking referral mission:", error);
    }
  };
  
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
      {/* 
        * @restricted
        * Componentes abaixo fazem parte do layout travado da página
        * Não modifique a estrutura ou ordem sem autorização específica
      */}
      
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
