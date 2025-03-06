
import { Medal, MapPin, Briefcase, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export const ProfileHeader = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const { toast } = useToast();

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMatchRequest = () => {
    setHasMatch(true);
    toast({
      title: "Solicitação de Match enviada!",
      description: "Você receberá uma notificação quando houver uma resposta.",
      duration: 5000,
    });
  };

  const cancelMatch = () => {
    setHasMatch(false);
    toast({
      title: "Solicitação de Match cancelada",
      description: "Você pode enviar uma nova solicitação quando quiser.",
      duration: 3000,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/lovable-uploads/6e9560e5-d1ff-4d44-80ea-38a5efa39e6a.png" alt="Profile" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Engenheiro Civil</Badge>
            <h1 className="text-2xl font-bold">Allan Assad</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>São Paulo, SP</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant={isFollowing ? "secondary" : "default"}
            onClick={toggleFollow}
            className="hover:scale-105 transition-transform"
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </Button>
          {hasMatch ? (
            <Button 
              variant="outline"
              onClick={cancelMatch}
              className="hover:bg-red-100 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar Match
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={handleMatchRequest}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Match
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground">
        Especialista em projetos estruturais com mais de 5 anos de experiência. 
        Foco em soluções sustentáveis e inovadoras.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Projetos Estruturais</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>127 seguidores</span>
        </div>
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-accent" />
          <span>3 conquistas</span>
        </div>
      </div>
    </Card>
  );
};
