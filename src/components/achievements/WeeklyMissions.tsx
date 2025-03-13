
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

type Mission = {
  id: string;
  title: string;
  description: string;
  requiredProgress: number;
  currentProgress: number;
  points: number;
  type: 'daily' | 'weekly';
  claimed?: boolean; // Add the claimed property to the type
};

export function WeeklyMissions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  
  useEffect(() => {
    if (user) {
      // Retrieve missions data from localStorage
      const missionsKey = `user_missions_${user.id}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        try {
          setMissions(JSON.parse(savedMissions));
        } catch (error) {
          console.error("Error parsing missions:", error);
          // Initialize with empty missions if there's an error
          setMissions([]);
        }
      } else {
        // If no missions exist yet, create default missions
        const defaultMissions: Mission[] = [
          {
            id: "mission-invite",
            title: "Convide engenheiros",
            description: "Convide 10 novos engenheiros para a plataforma",
            requiredProgress: 10,
            currentProgress: 0,
            points: 50,
            type: 'weekly'
          },
          {
            id: "mission-connect",
            title: "Faça conexões",
            description: "Conecte-se com 5 novos engenheiros",
            requiredProgress: 5,
            currentProgress: 0,
            points: 30,
            type: 'weekly'
          },
          {
            id: "mission-post",
            title: "Compartilhe conhecimento",
            description: "Publique um artigo técnico",
            requiredProgress: 1,
            currentProgress: 0,
            points: 20,
            type: 'weekly'
          }
        ];
        
        setMissions(defaultMissions);
        // Save default missions to localStorage
        localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
      }
    }
  }, [user]);
  
  const handleClaimReward = (missionId: string) => {
    if (!user) return;
    
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && mission.currentProgress >= mission.requiredProgress) {
        // Mark as claimed (in a real app, you'd update this in the database)
        return { ...mission, claimed: true };
      }
      return mission;
    });
    
    setMissions(updatedMissions);
    localStorage.setItem(`user_missions_${user.id}`, JSON.stringify(updatedMissions));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Missões da Semana</CardTitle>
        <Badge variant="outline" className="ml-2 px-3 py-1">
          Recompensas disponíveis
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.length > 0 ? (
            missions.map(mission => (
              <div key={mission.id} className="bg-card border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  <Badge variant="secondary">{mission.points} pts</Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso</span>
                    <span>
                      {mission.currentProgress}/{mission.requiredProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(mission.currentProgress / mission.requiredProgress) * 100} 
                    className="h-2"
                  />
                </div>
                {mission.currentProgress >= mission.requiredProgress && !mission.claimed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full" 
                    onClick={() => handleClaimReward(mission.id)}
                  >
                    Resgatar recompensa
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Nenhuma missão disponível no momento</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
