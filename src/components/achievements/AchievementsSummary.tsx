
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/types/profile";

interface AchievementsSummaryProps {
  totalPoints: number;
  completedCount: number;
}

export const AchievementsSummary = ({ totalPoints, completedCount }: AchievementsSummaryProps) => {
  // Calculate progress for rewards
  const nextMilestone = totalPoints < 500 ? 500 : 
                        totalPoints < 1000 ? 1000 : 
                        totalPoints < 2000 ? 2000 : 
                        totalPoints < 5000 ? 5000 : 10000;
  
  const currentMilestone = totalPoints < 500 ? 0 : 
                          totalPoints < 1000 ? 500 : 
                          totalPoints < 2000 ? 1000 : 
                          totalPoints < 5000 ? 2000 : 5000;
  
  const progress = ((totalPoints - currentMilestone) / (nextMilestone - currentMilestone)) * 100;
  
  const getRewardDescription = (milestone: number) => {
    switch (milestone) {
      case 500:
        return "Destaque no feed por 7 dias";
      case 1000:
        return "Acesso a conteúdos exclusivos";
      case 2000:
        return "Um mês grátis de funcionalidades premium";
      case 5000:
        return "Participação em um sorteio mensal";
      default:
        return "Recompensa especial";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Minhas Conquistas</CardTitle>
            <CardDescription>
              Acompanhe seu progresso e desbloqueie recompensas
            </CardDescription>
          </div>
          <Badge className="px-3 py-1 text-lg bg-yellow-100 text-yellow-800 border-yellow-200">
            {totalPoints} pontos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Próxima recompensa: {getRewardDescription(nextMilestone)}</span>
            <span className="text-sm font-medium">{totalPoints} / {nextMilestone} pontos</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-700">{completedCount}</h3>
                <p className="text-sm text-green-600">Conquistas Desbloqueadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-700">3</h3>
                <p className="text-sm text-blue-600">Ranking Mensal</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-700">2</h3>
                <p className="text-sm text-purple-600">Missões Concluídas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-700">1</h3>
                <p className="text-sm text-amber-600">Recompensas Disponíveis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
