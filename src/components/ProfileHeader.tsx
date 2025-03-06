
import { Medal, MapPin, Briefcase, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileHeader = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMatchRequest, setShowMatchRequest] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const sendMatchRequest = () => {
    setShowMatchRequest(true);
    setTimeout(() => setShowMatchRequest(false), 3000);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Engenheiro Civil</Badge>
            <h1 className="text-2xl font-bold">João Silva</h1>
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
            className="hover-scale"
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </Button>
          <Button 
            variant="outline"
            onClick={sendMatchRequest}
            className="hover-scale"
          >
            Match
          </Button>
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

      {showMatchRequest && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          Solicitação de Match enviada!
        </div>
      )}
    </Card>
  );
};
