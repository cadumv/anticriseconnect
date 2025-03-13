
import { Mission } from "../../types/mission";

/**
 * Get default missions with our new missions
 */
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
