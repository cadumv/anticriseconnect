
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/types/profile";
import { 
  Trophy, Medal, Star, FileText, User, MessageCircle, HandshakeIcon, Gem, Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList = ({ achievements }: AchievementsListProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
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

  return (
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
  );
};
