
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

interface AchievementsProps {
  showProfileSpecific?: boolean;
  profileId?: string;
  isDemoProfile?: boolean;
  compact?: boolean;
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
  compact = false
}: AchievementsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If showing for a specific profile and it's not the current user
  const showingForOtherProfile = showProfileSpecific && profileId !== user?.id;
  
  // For demo profile, show all achievements
  const demoMode = isDemoProfile && showProfileSpecific;

  // Calculate total points - only for demo or authenticated users
  const achievements = demoMode ? DEMO_ACHIEVEMENTS : [];
  const completedAchievements = achievements.filter(a => a.completed);
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);

  const handleViewAllAchievements = () => {
    navigate('/achievements');
  };

  return (
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {compact 
                ? completedAchievements.slice(0, 4).map(achievement => (
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
                : DEMO_ACHIEVEMENTS.map(achievement => (
                    <div 
                      key={achievement.id}
                      className={`flex flex-col items-center p-3 bg-gray-50 rounded-lg ${demoMode && !achievement.completed ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-12 h-12 ${demoMode || achievement.completed ? 'bg-blue-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-2`}>
                        {renderIcon(achievement.icon)}
                      </div>
                      <span className="text-sm text-center font-medium">{achievement.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{achievement.points} pts</span>
                    </div>
                  ))
              }
            </div>
            
            {compact && completedAchievements.length > 0 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={handleViewAllAchievements}
                >
                  Ver todas as conquistas <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Faça login para ver suas conquistas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
