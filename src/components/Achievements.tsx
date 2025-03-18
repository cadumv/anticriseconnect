
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { DEMO_ACHIEVEMENTS } from "@/types/profile";
import { 
  Trophy, Medal, Star, FileText, User, 
  MessageCircle, HandshakeIcon, Gem, ArrowRight 
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AchievementsDialog } from "./AchievementsDialog";
import { Achievement } from "@/types/profile";
import { AchievementUnlocked } from "./AchievementUnlocked";
import { AchievementsManager } from "@/services/AchievementsManager";

interface AchievementsProps {
  showProfileSpecific?: boolean;
  profileId?: string;
  isDemoProfile?: boolean;
  compact?: boolean;
  achievements?: Achievement[]; // Add the achievements prop
}

// Helper function to render the appropriate icon
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'trophy':
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 'medal':
      return <Medal className="h-5 w-5 text-blue-500" />;
    case 'star':
      return <Star className="h-5 w-5 text-yellow-500" />;
    case 'file-text':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'user':
      return <User className="h-5 w-5 text-gray-500" />;
    case 'message-circle':
      return <MessageCircle className="h-5 w-5 text-green-500" />;
    case 'handshake':
      return <HandshakeIcon className="h-5 w-5 text-purple-500" />;
    case 'gem':
      return <Gem className="h-5 w-5 text-indigo-500" />;
    default:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
  }
};

export const Achievements = ({ 
  showProfileSpecific = false, 
  profileId, 
  isDemoProfile = false,
  compact = false,
  achievements = [] // Add default empty array for achievements
}: AchievementsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for detecting newly unlocked achievements
  const [prevAchievements, setPrevAchievements] = useState<Achievement[]>(achievements);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // If showing for a specific profile and it's not the current user
  const showingForOtherProfile = showProfileSpecific && profileId !== user?.id;
  
  // For demo profile, show all achievements
  const demoMode = isDemoProfile && showProfileSpecific;

  // Get achievements data - use passed achievements or demo achievements if in demo mode
  const achievementsToShow = demoMode ? DEMO_ACHIEVEMENTS : achievements;
  const completedAchievements = achievementsToShow.filter(a => a.completed);
  
  // Check for newly unlocked achievements
  useEffect(() => {
    if (!achievementsToShow.length) {
      setPrevAchievements([]);
      return;
    }

    // Find achievements that were just unlocked
    const newlyUnlocked = achievementsToShow.filter((ach) => {
      const prev = prevAchievements.find((p) => p.id === ach.id);
      // If it was incomplete before and now is complete => newly unlocked
      return prev && !prev.completed && ach.completed;
    });

    // Add newly unlocked achievements to the queue
    if (newlyUnlocked.length > 0) {
      setAchievementQueue((prevQ) => [...prevQ, ...newlyUnlocked]);
    }

    // Update previous achievements
    setPrevAchievements(achievementsToShow);
  }, [achievementsToShow, prevAchievements]);

  // Show next achievement in queue
  useEffect(() => {
    if (!activeAchievement && achievementQueue.length > 0 && isMounted.current) {
      setActiveAchievement(achievementQueue[0]);
      setAchievementQueue((prevQ) => prevQ.slice(1));
    }
  }, [achievementQueue, activeAchievement]);

  // Handle achievement popup close
  const handleAchievementClose = () => {
    setActiveAchievement(null);
  };
  
  // Calculate total points - only for demo or authenticated users
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  
  // Get top 3 most valuable completed achievements
  const topAchievements = [...completedAchievements]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  const handleViewAllAchievements = () => {
    if (compact) {
      navigate('/achievements');
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleShareAchievement = () => {
    // This is already handled inside the AchievementUnlocked component now
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Conquistas</CardTitle>
          {!compact && totalPoints > 0 && (
            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
              {totalPoints} pontos
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {(user || showingForOtherProfile || demoMode) ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {topAchievements.length > 0 ? (
                  topAchievements.map(achievement => (
                    <div 
                      key={achievement.id} 
                      className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        {renderIcon(achievement.icon)}
                      </div>
                      <span className="text-sm text-center font-medium">{achievement.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{achievement.points} pts</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4">
                    <p className="text-gray-500">Nenhuma conquista obtida ainda</p>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={handleViewAllAchievements}
                >
                  Ver todas as conquistas <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Faça login para ver suas conquistas</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {!compact && (
        <AchievementsDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          achievements={achievementsToShow}
        />
      )}
      
      {/* Achievement popup for newly unlocked achievements */}
      {activeAchievement && (
        <AchievementUnlocked 
          achievement={activeAchievement}
          onClose={handleAchievementClose}
          onShare={handleShareAchievement}
        />
      )}
    </>
  );
};
