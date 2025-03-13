
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsSummaryProps {
  totalPoints: number;
  completedCount: number;
  totalCount?: number;
}

export function AchievementsSummary({ 
  totalPoints,
  completedCount,
  totalCount = 12 // Default total achievements count
}: AchievementsSummaryProps) {
  // Calculate next level threshold
  const currentLevel = Math.floor(totalPoints / 500) + 1;
  const pointsForNextLevel = currentLevel * 500;
  const progress = (totalPoints % 500) / 5; // Progress percentage to next level
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-center items-center md:items-start">
            <h3 className="text-lg font-semibold text-blue-900">Nível de Engenharia</h3>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">Nível {currentLevel}</p>
                <p className="text-sm text-blue-600">{totalPoints} pontos totais</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col justify-center">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-blue-800">Progresso para Nível {currentLevel + 1}</span>
              <span className="text-sm font-medium text-blue-800">{totalPoints % 500}/{500} pontos</span>
            </div>
            <Progress 
              value={progress} 
              className={cn("h-3", "bg-blue-200")}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">Conquistas</p>
                <p className="text-xl font-semibold">{completedCount}/{totalCount}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">Pontos</p>
                <p className="text-xl font-semibold">{totalPoints}</p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-blue-100 hidden md:block">
                <p className="text-xs text-blue-600">Próximo Nível</p>
                <p className="text-xl font-semibold">{pointsForNextLevel - totalPoints} pts</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
