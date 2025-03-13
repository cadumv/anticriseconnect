
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, FileText, Users, Mail, Share, Copy, Check, Link } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredProgress: number;
  currentProgress: number;
  reward: number;
  action?: () => void;
  actionLabel?: string;
}

export const WeeklyMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Generate referral link
      const baseUrl = window.location.origin;
      const refLink = `${baseUrl}/signup?ref=${user.id}`;
      setReferralLink(refLink);
      
      // In a real implementation, we would fetch the user's mission progress from the backend
      loadUserMissions(user.id);
    } else {
      // Default missions with no progress for non-authenticated users
      loadDefaultMissions();
    }
  }, [user]);
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para sua área de transferência."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const loadUserMissions = (userId: string) => {
    try {
      // Try to get missions from localStorage
      const missionsKey = `user_missions_${userId}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        const parsedMissions = JSON.parse(savedMissions);
        
        // Add the action to the invite mission
        const updatedMissions = parsedMissions.map((mission: Mission) => {
          if (mission.id === "mission-invite") {
            return {
              ...mission,
              action: copyReferralLink,
              actionLabel: copied ? "Copiado!" : "Copiar Link"
            };
          }
          return mission;
        });
        
        setMissions(updatedMissions);
      } else {
        // First time - set up default missions with 0 progress
        const defaultMissions = getDefaultMissions();
        localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
        setMissions(defaultMissions.map(mission => {
          if (mission.id === "mission-invite") {
            return {
              ...mission,
              action: copyReferralLink,
              actionLabel: copied ? "Copiado!" : "Copiar Link"
            };
          }
          return mission;
        }));
      }
      
      // Check for referrals count from localStorage
      const referralsKey = `user_referrals_${userId}`;
      const referralsData = localStorage.getItem(referralsKey);
      
      if (referralsData) {
        const referrals = JSON.parse(referralsData);
        
        // Update the mission progress
        updateMissionProgress(userId, "mission-invite", referrals.length);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
      // Fallback to default missions
      loadDefaultMissions();
    }
  };
  
  const updateMissionProgress = (userId: string, missionId: string, progress: number) => {
    try {
      const missionsKey = `user_missions_${userId}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        const parsedMissions = JSON.parse(savedMissions);
        const updatedMissions = parsedMissions.map((mission: Mission) => {
          if (mission.id === missionId) {
            return {
              ...mission,
              currentProgress: progress
            };
          }
          return mission;
        });
        
        localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
        
        // Update the missions state with the action for the invite mission
        setMissions(updatedMissions.map(mission => {
          if (mission.id === "mission-invite") {
            return {
              ...mission,
              action: copyReferralLink,
              actionLabel: copied ? "Copiado!" : "Copiar Link"
            };
          }
          return mission;
        }));
      }
    } catch (error) {
      console.error('Error updating mission progress:', error);
    }
  };
  
  const loadDefaultMissions = () => {
    const defaultMissions = getDefaultMissions();
    setMissions(defaultMissions.map(mission => {
      if (mission.id === "mission-invite") {
        return {
          ...mission,
          action: copyReferralLink,
          actionLabel: copied ? "Copiado!" : "Copiar Link"
        };
      }
      return mission;
    }));
  };
  
  const getDefaultMissions = (): Mission[] => {
    return [
      {
        id: "mission-profile",
        title: "Complete seu Perfil",
        description: "Preencha todas as informações do seu perfil profissional",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        requiredProgress: 1,
        currentProgress: 0,
        reward: 50
      },
      {
        id: "mission-invite",
        title: "Convide Engenheiros",
        description: "Indique 10 novos usuários para se cadastrarem na plataforma",
        icon: <Share className="h-5 w-5 text-orange-500" />,
        requiredProgress: 10,
        currentProgress: 0,
        reward: 200
      },
      {
        id: "mission-connect",
        title: "Crie sua Rede",
        description: "Faça 3 novas conexões com engenheiros na plataforma",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        requiredProgress: 3,
        currentProgress: 0,
        reward: 50
      },
      {
        id: "mission-message",
        title: "Inicie Conversas",
        description: "Envie uma mensagem para 3 novas conexões",
        icon: <Mail className="h-5 w-5 text-green-500" />,
        requiredProgress: 3,
        currentProgress: 0,
        reward: 50
      },
      {
        id: "mission-publish",
        title: "Apresente seu Trabalho",
        description: "Faça sua primeira publicação apresentando um serviço ou área de atuação",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        requiredProgress: 1,
        currentProgress: 0,
        reward: 100
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
                    {mission.action && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="mt-2 flex items-center gap-1"
                        onClick={mission.action}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Link className="h-3 w-3" />}
                        {mission.actionLabel}
                      </Button>
                    )}
                    {isCompleted && !mission.action && (
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
