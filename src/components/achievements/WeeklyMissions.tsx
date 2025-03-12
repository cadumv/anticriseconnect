
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, FileText, Users, Mail, Share } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredProgress: number;
  currentProgress: number;
  reward: number;
}

export const WeeklyMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  
  useEffect(() => {
    if (user) {
      // In a real implementation, we would fetch the user's mission progress from the backend
      // For now, we'll set all mission progress to 0 for new user experience
      loadUserMissions(user.id);
    } else {
      // Default missions with no progress for non-authenticated users
      loadDefaultMissions();
    }
  }, [user]);
  
  const loadUserMissions = (userId: string) => {
    try {
      // Try to get missions from localStorage
      const missionsKey = `user_missions_${userId}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        setMissions(JSON.parse(savedMissions));
      } else {
        // First time - set up default missions with 0 progress
        const defaultMissions = getDefaultMissions();
        localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
        setMissions(defaultMissions);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
      // Fallback to default missions
      loadDefaultMissions();
    }
  };
  
  const loadDefaultMissions = () => {
    setMissions(getDefaultMissions());
  };
  
  const getDefaultMissions = (): Mission[] => {
    return [
      {
        id: "mission-1",
        title: "Crie sua Rede",
        description: "Faça 3 novas conexões com engenheiros na plataforma",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        requiredProgress: 3,
        currentProgress: 0, // Set to 0 for new user experience
        reward: 50
      },
      {
        id: "mission-2",
        title: "Inicie Conversas",
        description: "Envie uma mensagem para 3 novas conexões",
        icon: <Mail className="h-5 w-5 text-green-500" />,
        requiredProgress: 3,
        currentProgress: 0, // Set to 0 for new user experience
        reward: 50
      },
      {
        id: "mission-3",
        title: "Apresente seu Trabal ho",
        description: "Faça sua primeira publicação apresentando um serviço ou área de atuação",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        requiredProgress: 1,
        currentProgress: 0, // Set to 0 for new user experience
        reward: 100
      },
      {
        id: "mission-4",
        title: "Compartilhe seu Conhecimento",
        description: "Publique um artigo técnico para colaborar com outros engenheiros",
        icon: <FileText className="h-5 w-5 text-indigo-500" />,
        requiredProgress: 1,
        currentProgress: 0, // Set to 0 for new user experience
        reward: 100
      },
      {
        id: "mission-5",
        title: "Convide Engenheiros",
        description: "Indique 10 novos usuários para se cadastrarem na plataforma",
        icon: <Share className="h-5 w-5 text-orange-500" />,
        requiredProgress: 10,
        currentProgress: 0, // Set to 0 for new user experience
        reward: 200
      }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missões de Progressão</CardTitle>
        <CardDescription>
          Complete missões para evoluir na plataforma e ganhar pontos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.map((mission) => {
            const isCompleted = mission.currentProgress >= mission.requiredProgress;
            return (
              <div 
                key={mission.id} 
                className={`border rounded-lg p-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${isCompleted ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                      {mission.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{mission.title}</h3>
                      <p className="text-sm text-gray-600">{mission.description}</p>
                      <p className="text-sm text-gray-600">Recompensa: {mission.reward} pontos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${isCompleted ? 'text-green-600' : ''}`}>
                      {mission.currentProgress}/{mission.requiredProgress}
                    </span>
                    <Progress 
                      value={(mission.currentProgress / mission.requiredProgress) * 100} 
                      className={`h-1 w-24 ${isCompleted ? 'bg-green-100' : ''}`}
                    />
                    {isCompleted && (
                      <span className="text-xs font-medium text-green-600 mt-1 block">Missão completa</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
