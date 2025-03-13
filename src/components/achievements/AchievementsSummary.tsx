
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DEMO_ACHIEVEMENTS } from "@/types/profile";

/**
 * @restricted
 * IMPORTANTE: Este componente faz parte da página de conquistas com formatação travada.
 * Não modifique a estrutura, layout ou estilo sem autorização específica.
 */
interface AchievementsSummaryProps {
  totalPoints: number;
  completedCount: number;
}

export function AchievementsSummary({ totalPoints, completedCount }: AchievementsSummaryProps) {
  const totalAchievements = DEMO_ACHIEVEMENTS.length;
  const completionPercentage = Math.round((completedCount / totalAchievements) * 100);
  
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Minhas Conquistas
          </span>
          <span className="text-sm font-normal bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
            {totalPoints} pontos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
              <p className="text-sm text-gray-600">Conquistas</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
              <p className="text-sm text-gray-600">Pontos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
