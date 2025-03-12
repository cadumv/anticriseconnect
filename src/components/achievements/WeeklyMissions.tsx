
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
      // For now, we'll simulate some progress with fixed data
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
        // First time - set up default missions
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
        currentProgress: user ? 2 : 0, // Simulate some progress for logged-in users
        reward: 50
      },
      {
        id: "mission-2",
        title: "Inicie Conversas",
        description: "Envie uma mensagem para 3 novas conexões",
        icon: <Mail className="h-5 w-5 text-green-500" />,
        requiredProgress: 3,
        currentProgress: user ? 1 : 0,
        reward: 50
      },
      {
        id: "mission-3",
        title: "Apresente seu Trabalho",
        description: "Faça sua primeira publicação apresentando um serviço ou área de atuação",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        requiredProgress: 1,
        currentProgress: user ? 0 : 0,
        reward: 100
      },
      {
        id: "mission-4",
        title: "Compartilhe seu Conhecimento",
        description: "Publique um artigo técnico para colaborar com outros engenheiros",
        icon: <FileText className="h-5 w-5 text-indigo-500" />,
        requiredProgress: 1,
        currentProgress: user ? 0 : 0,
        reward: 100
      },
      {
        id: "mission-5",
        title: "Convide Engenheiros",
        description: "Indique 10 novos usuários para se cadastrarem na plataforma",
        icon: <Share className="h-5 w-5 text-orange-500" />,
        requiredProgress: 10,
        currentProgress: user ? 3 : 0,
        reward: 200
      }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missões Semanais</CardTitle>
        <CardDescription>
          Complete missões para ganhar pontos e recompensas extras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {mission.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{mission.title}</h3>
                    <p className="text-sm text-gray-600">{mission.description}</p>
                    <p className="text-sm text-gray-600">Recompensa: {mission.reward} pontos</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{mission.currentProgress}/{mission.requiredProgress}</span>
                  <Progress 
                    value={(mission.currentProgress / mission.requiredProgress) * 100} 
                    className="h-1 w-24" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
