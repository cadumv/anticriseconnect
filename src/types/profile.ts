export interface ProfileData {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  professional_description: string;
  areas_of_expertise: string[];
  avatar_url: string | null;
  phone: string;
  education?: Education[];
  experiences?: Experience[];
}

export interface Publication {
  id: string;
  title: string;
  snippet: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  points: number;
  category: 'profile' | 'connection' | 'publication' | 'evaluation' | 'partnership';
  level?: 'bronze' | 'silver' | 'gold';
}

export const DEMO_PROFILE: ProfileData = {
  id: "demo-profile-123",
  name: "João",
  username: "joao.eng",
  engineering_type: "Engenharia Civil",
  professional_description: "Engenheiro civil com experiência em projetos estruturais e gerenciamento de obras residenciais e comerciais. Especialista em cálculos estruturais e soluções sustentáveis para construções.",
  areas_of_expertise: ["Projetos Estruturais", "Gerenciamento de Obras", "Construção Sustentável", "Consultoria Técnica"],
  avatar_url: null,
  phone: "(11) 98765-4321",
  education: [
    {
      institution: "Universidade de São Paulo",
      degree: "Bacharelado",
      fieldOfStudy: "Engenharia Civil",
      startYear: "2012",
      endYear: "2017",
      description: "Foco em estruturas e construções sustentáveis"
    }
  ],
  experiences: [
    {
      company: "Construtora ABC",
      position: "Engenheiro Civil Sênior",
      location: "São Paulo, SP",
      startMonth: "Janeiro",
      startYear: "2018",
      endMonth: "",
      endYear: "",
      current: true,
      description: "Responsável por projetos estruturais e supervisão de obras residenciais"
    }
  ]
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

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Perfil Completo",
    description: "Preencheu todas as informações do perfil",
    icon: "trophy",
    completed: true,
    points: 50,
    category: 'profile'
  },
  {
    id: "ach-2",
    title: "Conexões Anticrise - Bronze",
    description: "Realizou 10 conexões com avaliação positiva",
    icon: "medal",
    completed: true,
    points: 100,
    category: 'connection',
    level: 'bronze'
  },
  {
    id: "ach-3",
    title: "Conexões Anticrise - Prata",
    description: "Realizou 50 conexões com avaliação positiva",
    icon: "medal",
    completed: false,
    points: 250,
    category: 'connection',
    level: 'silver'
  },
  {
    id: "ach-4",
    title: "Primeiro Artigo",
    description: "Publicou seu primeiro artigo técnico",
    icon: "file-text",
    completed: true,
    points: 100,
    category: 'publication'
  },
  {
    id: "ach-5",
    title: "Conexão de Valor",
    description: "Recebeu 5 avaliações positivas de outros engenheiros",
    icon: "star",
    completed: true,
    points: 150,
    category: 'evaluation'
  },
  {
    id: "ach-6",
    title: "Conexão Estratégica",
    description: "Formou uma parceria através da plataforma",
    icon: "handshake",
    completed: false,
    points: 500,
    category: 'partnership'
  },
  {
    id: "ach-7",
    title: "Parceria Lucrativa",
    description: "Fechou um serviço pago através da plataforma",
    icon: "gem",
    completed: false,
    points: 1000,
    category: 'partnership'
  },
  {
    id: "ach-8",
    title: "Perfil Ultra Ativo",
    description: "10 publicações por semana durante 1 mês",
    icon: "star",
    completed: false,
    points: 300,
    category: 'publication'
  }
];
