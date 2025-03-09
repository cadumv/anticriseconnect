
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DEMO_ACHIEVEMENTS, Achievement } from "@/types/profile";
import { 
  Trophy, Medal, Star, FileText, User, MessageCircle, HandshakeIcon, Gem, Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/ProfileHeader";

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // For demo purposes, we'll use DEMO_ACHIEVEMENTS
  const achievements = DEMO_ACHIEVEMENTS;
  const completedAchievements = achievements.filter(a => a.completed);
  const totalPoints = completedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  
  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'profile', name: 'Perfil' },
    { id: 'connection', name: 'Conexões' },
    { id: 'publication', name: 'Publicações' },
    { id: 'evaluation', name: 'Avaliações' },
    { id: 'partnership', name: 'Parcerias' }
  ];

  // Filter achievements based on active tab
  const filteredAchievements = activeTab === 'all' 
    ? achievements
    : achievements.filter(a => a.category === activeTab);

  // Helper function to render the appropriate icon
  const renderIcon = (iconName: string, size: number = 5) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className={`h-${size} w-${size} text-yellow-500`} />;
      case 'medal':
        return <Medal className={`h-${size} w-${size} text-blue-500`} />;
      case 'star':
        return <Star className={`h-${size} w-${size} text-yellow-500`} />;
      case 'file-text':
        return <FileText className={`h-${size} w-${size} text-blue-500`} />;
      case 'user':
        return <User className={`h-${size} w-${size} text-gray-500`} />;
      case 'message-circle':
        return <MessageCircle className={`h-${size} w-${size} text-green-500`} />;
      case 'handshake':
        return <HandshakeIcon className={`h-${size} w-${size} text-purple-500`} />;
      case 'gem':
        return <Gem className={`h-${size} w-${size} text-indigo-500`} />;
      default:
        return <Trophy className={`h-${size} w-${size} text-yellow-500`} />;
    }
  };

  const getLevelColor = (level?: 'bronze' | 'silver' | 'gold') => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-600';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleShare = (achievement: Achievement) => {
    toast.success(`Conquista "${achievement.title}" compartilhada no feed!`);
  };

  // Calculate progress for rewards
  const nextMilestone = totalPoints < 500 ? 500 : 
                        totalPoints < 1000 ? 1000 : 
                        totalPoints < 2000 ? 2000 : 
                        totalPoints < 5000 ? 5000 : 10000;
  
  const currentMilestone = totalPoints < 500 ? 0 : 
                          totalPoints < 1000 ? 500 : 
                          totalPoints < 2000 ? 1000 : 
                          totalPoints < 5000 ? 2000 : 5000;
  
  const progress = ((totalPoints - currentMilestone) / (nextMilestone - currentMilestone)) * 100;
  
  const getRewardDescription = (milestone: number) => {
    switch (milestone) {
      case 500:
        return "Destaque no feed por 7 dias";
      case 1000:
        return "Acesso a conteúdos exclusivos";
      case 2000:
        return "Um mês grátis de funcionalidades premium";
      case 5000:
        return "Participação em um sorteio mensal";
      default:
        return "Recompensa especial";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProfileHeader />
      
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Minhas Conquistas</CardTitle>
              <CardDescription>
                Acompanhe seu progresso e desbloqueie recompensas
              </CardDescription>
            </div>
            <Badge className="px-3 py-1 text-lg bg-yellow-100 text-yellow-800 border-yellow-200">
              {totalPoints} pontos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Próxima recompensa: {getRewardDescription(nextMilestone)}</span>
              <span className="text-sm font-medium">{totalPoints} / {nextMilestone} pontos</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-700">{completedAchievements.length}</h3>
                  <p className="text-sm text-green-600">Conquistas Desbloqueadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-blue-700">3</h3>
                  <p className="text-sm text-blue-600">Ranking Mensal</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-purple-700">2</h3>
                  <p className="text-sm text-purple-600">Missões Concluídas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-amber-700">1</h3>
                  <p className="text-sm text-amber-600">Recompensas Disponíveis</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievements List */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`border rounded-lg p-4 ${achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${achievement.completed ? 'bg-white' : 'bg-gray-100'}`}>
                        {renderIcon(achievement.icon, 6)}
                        
                        {achievement.level && (
                          <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${getLevelColor(achievement.level)} flex items-center justify-center text-white text-xs font-bold`}>
                            {achievement.level === 'bronze' ? 'B' : achievement.level === 'silver' ? 'S' : 'G'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{achievement.title}</h3>
                          <Badge variant={achievement.completed ? "default" : "outline"} className="ml-2">
                            {achievement.points} pontos
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                      
                      {achievement.completed && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500"
                          onClick={() => handleShare(achievement)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredAchievements.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Nenhuma conquista encontrada nesta categoria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Weekly Missions */}
      <Card>
        <CardHeader>
          <CardTitle>Missões Semanais</CardTitle>
          <CardDescription>
            Complete missões para ganhar pontos e recompensas extras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fazer 3 novas conexões</h3>
                    <p className="text-sm text-gray-600">Recompensa: 50 pontos</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">2/3</span>
                  <Progress value={66} className="h-1 w-24" />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Publicar 1 artigo técnico</h3>
                    <p className="text-sm text-gray-600">Recompensa: 100 pontos</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">0/1</span>
                  <Progress value={0} className="h-1 w-24" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Mensal</CardTitle>
          <CardDescription>
            Os 10 engenheiros com mais pontos este mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { position: 1, name: "Carlos Silva", points: 2450, avatar: null },
              { position: 2, name: "Mariana Costa", points: 2120, avatar: null },
              { position: 3, name: "João", points: 1850, avatar: null },
              { position: 4, name: "Ana Oliveira", points: 1620, avatar: null },
              { position: 5, name: "Pedro Santos", points: 1580, avatar: null }
            ].map((engineer, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-lg ${idx === 2 ? 'bg-blue-50 border border-blue-100' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold 
                  ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    idx === 1 ? 'bg-gray-100 text-gray-700' : 
                    idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                  {engineer.position}
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-medium">{engineer.name}</h3>
                </div>
                <div>
                  <Badge variant="outline" className="bg-gray-50">
                    {engineer.points} pts
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsPage;
