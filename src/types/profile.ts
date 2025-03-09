
export interface ProfileData {
  id: string;
  name: string;
  engineering_type: string;
  professional_description: string;
  areas_of_expertise: string[];
  avatar_url: string | null;
  phone: string;
}

export interface Publication {
  id: string;
  title: string;
  snippet: string;
  date: string;
}

export const DEMO_PROFILE: ProfileData = {
  id: "demo-profile-123",
  name: "João",
  engineering_type: "Engenharia Civil",
  professional_description: "Engenheiro civil com experiência em projetos estruturais e gerenciamento de obras residenciais e comerciais. Especialista em cálculos estruturais e soluções sustentáveis para construções.",
  areas_of_expertise: ["Projetos Estruturais", "Gerenciamento de Obras", "Construção Sustentável", "Consultoria Técnica"],
  avatar_url: null,
  phone: "(11) 98765-4321"
};

export const DEMO_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    title: "Análise comparativa de métodos estruturais em edificações residenciais",
    snippet: "Estudo sobre diferentes abordagens de design estrutural e seu impacto na eficiência e custo de construções residenciais de médio porte.",
    date: "15/03/2023"
  },
  {
    id: "pub-2",
    title: "Sustentabilidade aplicada em projetos de infraestrutura urbana",
    snippet: "Técnicas e materiais eco-amigáveis para melhorar a sustentabilidade em projetos de infraestrutura urbana sem comprometer a durabilidade.",
    date: "22/11/2022"
  }
];
