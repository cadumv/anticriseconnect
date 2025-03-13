
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
}

interface AchievementsSidebarProps {
  achievements: Achievement[];
  totalPoints: number;
}

export function AchievementsSidebar({ achievements, totalPoints }: AchievementsSidebarProps) {
  // Get top 2 completed achievements (highest points first)
  const topAchievements = achievements
    .filter(a => a.completed)
    .sort((a, b) => b.points - a.points)
    .slice(0, 2);

  // Helper function to render appropriate icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'file-text':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'trophy':
      default:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Conquistas</CardTitle>
        {totalPoints > 0 && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
            {totalPoints} pontos
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
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
            <div className="col-span-2 text-center py-4">
              <p className="text-gray-500">Nenhuma conquista obtida ainda</p>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => window.location.href = '/achievements'}
          >
            Ver todas as conquistas <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
