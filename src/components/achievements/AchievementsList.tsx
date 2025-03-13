
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from "@/types/profile";
import { Trophy, Medal, Star, FileText, User, MessageCircle, HandshakeIcon, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  // Get only completed achievements sorted by points (highest first)
  const completedAchievements = achievements
    .filter(a => a.completed)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);  // Show only top 3 achievements
  
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Conquistas Recentes</CardTitle>
        <Badge variant="outline" className="ml-2 px-3 py-1">
          {completedAchievements.length} de {achievements.length}
        </Badge>
      </CardHeader>
      <CardContent>
        {completedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {completedAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  {renderIcon(achievement.icon)}
                </div>
                <span className="text-sm text-center font-medium">{achievement.title}</span>
                <span className="text-xs text-center text-gray-500 mt-1">{achievement.points} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seja bem-vindo(a) à sua jornada de conquistas!</p>
            <p className="text-sm text-muted-foreground mt-1">Complete as missões abaixo para desbloquear suas primeiras conquistas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
