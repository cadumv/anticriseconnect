
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
    title: "Compartilhe conhecimento",
    description: "Chegou a hora de mostrar o que você sabe e ajudar mais profissionais com o seu conhecimento. Compartilhe um artigo técnico de um serviço ou case de sucesso.",
    requiredProgress: 1,
    currentProgress: 0,
    points: 30,
    type: 'weekly',
    sequence: maxSequence + 1
  };
};

// Get default missions
export const getDefaultMissions = (): Mission[] => {
  return [
    {
      id: "mission-profile",
      title: "Complete seu perfil",
      description: "Ao completar o seu perfil os profissionais da plataforma conseguem te achar mais facilmente",
      requiredProgress: 1,
      currentProgress: 0,
      points: 50,
      type: 'weekly',
      sequence: 1
    },
    {
      id: "mission-connect",
      title: "Faça conexões",
      description: "A parceria começa na conexão anticrise. Faça a sua para mais profissionais te conhecerem",
      requiredProgress: 20,
      currentProgress: 0,
      points: 30,
      type: 'weekly',
      sequence: 2
    },
    {
      id: "mission-post",
      title: "Sua primeira publicação",
      description: "Faça a sua primeira publicação para os engenheiros(as) conhecerem seus serviços ou áreas de atuação",
      requiredProgress: 1,
      currentProgress: 0,
      points: 20,
      type: 'weekly',
      sequence: 3
    },
    {
      id: "mission-knowledge",
      title: "Compartilhe conhecimento",
      description: "Chegou a hora de mostrar o que você sabe e ajudar mais profissionais com o seu conhecimento. Compartilhe um artigo técnico de um serviço ou case de sucesso.",
      requiredProgress: 1,
      currentProgress: 0,
      points: 30,
      type: 'weekly',
      sequence: 4
    }
  ];
};
