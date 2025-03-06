
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SuggestedProfile {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
}

const suggestedProfiles: SuggestedProfile[] = [
  {
    id: "1",
    name: "Ana Costa",
    avatar: "/placeholder.svg",
    specialty: "Engenharia Civil"
  },
  {
    id: "2",
    name: "Pedro Santos",
    avatar: "/placeholder.svg",
    specialty: "Engenharia Mecânica"
  },
  {
    id: "3",
    name: "Lucia Ferreira",
    avatar: "/placeholder.svg",
    specialty: "Engenharia Elétrica"
  }
];

export const Discovery = () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Sugestões para Você</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {suggestedProfiles.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {profile.specialty}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Seguir
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
