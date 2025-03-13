
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
  claimed?: boolean;
  completed?: boolean;
  completedDate?: string;
  sequence?: number;
};

export function WeeklyMissions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  
  // Function to check if a previous mission in sequence was completed
  const isPreviousMissionCompleted = (missions: Mission[], sequenceNumber: number) => {
    // If it's the first mission, no previous to check
    if (sequenceNumber <= 1) return true;
    
    // Find the previous mission in sequence
    const previousMission = missions.find(m => m.sequence === sequenceNumber - 1);
    return previousMission?.completed || false;
  };

  // Function to check if a knowledge sharing mission can be added
  const canAddKnowledgeMission = (missions: Mission[]) => {
    // Get the knowledge sharing missions
    const knowledgeMissions = missions.filter(m => m.id.startsWith("mission-knowledge"));
    
    // If there are no knowledge missions, we can add the first one
    if (knowledgeMissions.length === 0) return true;
    
    // If the latest knowledge mission is completed, we can add a new one
    const latestKnowledgeMission = knowledgeMissions.sort((a, b) => 
      (b.sequence || 0) - (a.sequence || 0)
    )[0];
    
    return latestKnowledgeMission.completed || false;
  };
  
  // Generate a new knowledge sharing mission
  const createNewKnowledgeMission = (existingMissions: Mission[]) => {
    // Get the highest sequence number
    const maxSequence = Math.max(0, ...existingMissions.map(m => m.sequence || 0));
    
    // Create a new mission with incremented sequence
    return {
      id: `mission-knowledge-${Date.now()}`,
      title: "Compartilhe conhecimento",
      description: "Compartilhe seu conhecimento publicando um artigo/informação técnica referente a um assunto de engenharia",
      requiredProgress: 1,
      currentProgress: 0,
      points: 30,
      type: 'weekly',
      sequence: maxSequence + 1
    };
  };
  
  useEffect(() => {
    if (user) {
      // Retrieve missions data from localStorage
      const missionsKey = `user_missions_${user.id}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        try {
          let parsedMissions = JSON.parse(savedMissions) as Mission[];
          
          // Check if we should add a new knowledge sharing mission
          if (canAddKnowledgeMission(parsedMissions)) {
            // Only add if it's been a week since the last one was completed
            const latestKnowledgeMission = parsedMissions
              .filter(m => m.id.startsWith("mission-knowledge") && m.completed)
              .sort((a, b) => {
                const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
                const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
                return dateB - dateA;
              })[0];
            
            const shouldAddNewMission = !latestKnowledgeMission || 
              (latestKnowledgeMission.completedDate &&
              Date.now() - new Date(latestKnowledgeMission.completedDate).getTime() >= 7 * 24 * 60 * 60 * 1000);
            
            if (shouldAddNewMission) {
              parsedMissions.push(createNewKnowledgeMission(parsedMissions));
              localStorage.setItem(missionsKey, JSON.stringify(parsedMissions));
            }
          }
          
          // Filter missions based on their sequence and completion status
          parsedMissions = parsedMissions.filter(mission => 
            !mission.sequence || isPreviousMissionCompleted(parsedMissions, mission.sequence)
          );
          
          setMissions(parsedMissions);
        } catch (error) {
          console.error("Error parsing missions:", error);
          // Initialize with empty missions if there's an error
          setMissions([]);
        }
      } else {
        // If no missions exist yet, create default missions
        const defaultMissions: Mission[] = [
          {
            id: "mission-profile",
            title: "Complete seu perfil",
            description: "Preencha todas as informações do seu perfil profissional",
            requiredProgress: 1,
            currentProgress: 0,
            points: 50,
            type: 'weekly',
            sequence: 1
          },
          {
            id: "mission-connect",
            title: "Faça conexões",
            description: "Conecte-se com 20 novos engenheiros na plataforma",
            requiredProgress: 20,
            currentProgress: 0,
            points: 30,
            type: 'weekly',
            sequence: 2
          },
          {
            id: "mission-post",
            title: "Sua primeira publicação",
            description: "Faça sua primeira publicação apresentando um serviço ou área de atuação",
            requiredProgress: 1,
            currentProgress: 0,
            points: 20,
            type: 'weekly',
            sequence: 3
          },
          {
            id: "mission-knowledge",
            title: "Compartilhe conhecimento",
            description: "Compartilhe seu conhecimento publicando um artigo/informação técnica referente a um assunto de engenharia",
            requiredProgress: 1,
            currentProgress: 0,
            points: 30,
            type: 'weekly',
            sequence: 4
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
        // Mark as claimed and completed
        return { 
          ...mission, 
          claimed: true, 
          completed: true,
          completedDate: new Date().toISOString()
        };
      }
      return mission;
    });
    
    setMissions(updatedMissions);
    localStorage.setItem(`user_missions_${user.id}`, JSON.stringify(updatedMissions));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Missões Anticrise</CardTitle>
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
