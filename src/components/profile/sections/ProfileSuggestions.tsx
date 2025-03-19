
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PlusCircle, CheckCircle } from "lucide-react";

interface SuggestedUser {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

// Mock data for suggested connections
const suggestedUsers: SuggestedUser[] = [
  {
    id: "edu-123",
    name: "Eduardo Cavalcanti",
    title: "Founder & President",
    subtitle: "Instituto Brasileiro de IA",
    avatarUrl: "https://i.pravatar.cc/150?u=eduardo",
    isFollowing: true
  },
  {
    id: "dan-456",
    name: "Daniel Lemos",
    title: "CTO",
    subtitle: "Aqui você Aprende a Faturar Acima dos 15 Mil Reais",
    avatarUrl: "https://i.pravatar.cc/150?u=daniel",
    isFollowing: true
  },
  {
    id: "jul-789",
    name: "Julian Massayoshi Ubukata",
    title: "Bacharel em Engenharia Mecânica e Tecnologia em Mecatrônica",
    avatarUrl: "https://i.pravatar.cc/150?u=julian"
  },
  {
    id: "dan-012",
    name: "Danilo Soares",
    title: "Proprietário da empresa DS Soluções em Engenharia",
    avatarUrl: "https://i.pravatar.cc/150?u=danilo"
  },
  {
    id: "pau-345",
    name: "Paulo Filho",
    title: "Engenheiro Mecânico",
    subtitle: "Autônomo na PS Soluções e Projetos",
    avatarUrl: "https://i.pravatar.cc/150?u=paulo"
  }
];

const connectionSuggestions: SuggestedUser[] = [
  {
    id: "reg-678",
    name: "Regiano Lopes Someoshi",
    title: "Coordenador de Projetos",
    subtitle: "TimeNow",
    avatarUrl: "https://i.pravatar.cc/150?u=regiano"
  }
];

export const ProfileSuggestions = () => {
  const [following, setFollowing] = useState<Record<string, boolean>>(() => {
    // Initialize with users already being followed
    const initialState: Record<string, boolean> = {};
    suggestedUsers.forEach(user => {
      if (user.isFollowing) {
        initialState[user.id] = true;
      }
    });
    return initialState;
  });

  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const handleFollow = (userId: string) => {
    setFollowing(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleConnect = (userId: string) => {
    setConnected(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const renderUserCard = (user: SuggestedUser, type: 'follow' | 'connect' = 'follow') => {
    const isFollowed = following[user.id] || false;
    const isConnected = connected[user.id] || false;
    const actionState = type === 'follow' ? isFollowed : isConnected;
    const handleAction = type === 'follow' ? handleFollow : handleConnect;

    return (
      <div key={user.id} className="flex items-start gap-3 py-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.title}</p>
          {user.subtitle && <p className="text-xs text-gray-500 truncate">{user.subtitle}</p>}
          <div className="mt-1">
            {type === 'follow' ? (
              <Button 
                variant={isFollowed ? "outline" : "outline"} 
                size="sm" 
                className={`w-full text-xs ${isFollowed ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => handleAction(user.id)}
              >
                {isFollowed ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Seguindo</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Seguir</span>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => handleAction(user.id)}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span>Conectar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-lg font-semibold">Mais perfis para você</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="divide-y">
            {suggestedUsers.map(user => renderUserCard(user))}
          </div>
          <Button 
            variant="link" 
            className="w-full mt-2 text-blue-600" 
            size="sm"
          >
            Exibir tudo
          </Button>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-lg font-semibold">Pessoas que talvez você conheça</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="divide-y">
            {connectionSuggestions.map(user => renderUserCard(user, 'connect'))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
