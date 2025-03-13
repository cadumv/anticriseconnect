
import { Mission } from "../types/mission";

// Function to check if a previous mission in sequence was completed
export const isPreviousMissionCompleted = (missions: Mission[], sequenceNumber: number): boolean => {
  // If it's the first mission, no previous to check
  if (sequenceNumber <= 1) return true;
  
  // Find the previous mission in sequence
  const previousMission = missions.find(m => m.sequence === sequenceNumber - 1);
  return previousMission?.completed || false;
};

// Function to check if a knowledge sharing mission can be added
export const canAddKnowledgeMission = (missions: Mission[]): boolean => {
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
export const createNewKnowledgeMission = (existingMissions: Mission[]): Mission => {
  // Get the highest sequence number
  const maxSequence = Math.max(0, ...existingMissions.map(m => m.sequence || 0));
  
  // Create a new mission with incremented sequence
  return {
    id: `mission-knowledge-${Date.now()}`,
    title: "Compartilhe seu Conhecimento",
    description: "Publique um artigo técnico para colaborar com outros engenheiros",
    requiredProgress: 1,
    currentProgress: 0,
    points: 30,
    type: 'weekly',
    sequence: maxSequence + 1
  };
};

// Update connection mission progress
export const updateConnectionMissionProgress = (userId: string): { 
  currentProgress: number;
  requiredProgress: number;
  missionCompleted: boolean;
} => {
  const missionsKey = `user_missions_${userId}`;
  const missionsData = localStorage.getItem(missionsKey);
  
  if (!missionsData) {
    return { currentProgress: 0, requiredProgress: 20, missionCompleted: false };
  }
  
  const missions = JSON.parse(missionsData);
  const connectionMission = missions.find((m: Mission) => m.id === "mission-connections");
  
  if (!connectionMission) {
    return { currentProgress: 0, requiredProgress: 20, missionCompleted: false };
  }
  
  // Count connections
  const connectionCount = getConnectionCount(userId);
  const requiredProgress = connectionMission.requiredProgress;
  const currentProgress = Math.min(connectionCount, requiredProgress);
  const wasAlreadyCompleted = connectionMission.completed;
  
  // Check if mission was just completed
  const justCompleted = !wasAlreadyCompleted && connectionCount >= requiredProgress;
  
  // Update mission status
  if (connectionCount > connectionMission.currentProgress || justCompleted) {
    const updatedMissions = missions.map((mission: Mission) => {
      if (mission.id === "mission-connections") {
        return {
          ...mission,
          currentProgress: currentProgress,
          completed: connectionCount >= requiredProgress,
          completedDate: justCompleted ? new Date().toISOString() : mission.completedDate
        };
      }
      return mission;
    });
    
    localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
  }
  
  return { 
    currentProgress, 
    requiredProgress, 
    missionCompleted: justCompleted 
  };
};

// Helper function to count user connections (duplicated from useMissions for direct access)
function getConnectionCount(userId: string): number {
  let connectionCount = 0;
  
  try {
    // Check connections made by the user
    const userConnectionKey = `connection_requests_${userId}`;
    const userRequests = localStorage.getItem(userConnectionKey);
    
    if (userRequests) {
      const parsedUserRequests = JSON.parse(userRequests);
      // Count accepted connection requests
      connectionCount += parsedUserRequests.filter((request: any) => 
        request.status === 'accepted'
      ).length;
    }
    
    // Check connections received by the user
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    
    for (const otherUserId of allUsers) {
      if (otherUserId === userId) continue;
      
      const connectionKey = `connection_requests_${otherUserId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const acceptedRequests = requests.filter((req: any) => 
          req.targetId === userId && req.status === 'accepted'
        );
        
        connectionCount += acceptedRequests.length;
      }
    }
    
    return connectionCount;
  } catch (error) {
    console.error('Error counting connections:', error);
    return 0;
  }
}

// Get default missions with our new missions
export const getDefaultMissions = (): Mission[] => {
  return [
    {
      id: "mission-profile",
      title: "Complete seu perfil",
      description: "Preencha todas as informações do seu perfil para que outros profissionais da plataforma possam encontrar você com mais facilidade. Um perfil completo aumenta sua visibilidade e credibilidade!",
      requiredProgress: 1,
      currentProgress: 0,
      points: 50,
      type: 'weekly',
      sequence: 1
    },
    {
      id: "mission-connections",
      title: "Faça 20 novas conexões com engenheiros",
      description: "A parceria começa com uma conexão! Expanda seu networking e conecte-se com 20 engenheiros dentro da plataforma. Quanto mais conexões, mais oportunidades para trocar experiências e fechar negócios.",
      requiredProgress: 20,
      currentProgress: 0,
      points: 100,
      type: 'weekly',
      sequence: 2
    },
    {
      id: "mission-publication",
      title: "Apresente seus serviços ou área de atuação",
      description: "Dê o primeiro passo para se destacar! Faça sua primeira publicação apresentando um serviço ou área de atuação em que deseja trabalhar. Deixe os engenheiros da plataforma conhecerem seu trabalho.",
      requiredProgress: 1,
      currentProgress: 0,
      points: 75,
      type: 'weekly',
      sequence: 3
    },
    {
      id: "mission-knowledge",
      title: "Compartilhe seu conhecimento",
      description: "Demonstre sua experiência e ajude a comunidade! Publique um artigo técnico compartilhando um serviço realizado, um estudo de caso ou um conhecimento relevante para outros engenheiros.",
      requiredProgress: 1,
      currentProgress: 0,
      points: 125,
      type: 'weekly',
      sequence: 4
    }
  ];
};
