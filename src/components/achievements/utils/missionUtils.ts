
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
