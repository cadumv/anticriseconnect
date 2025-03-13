
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

type RankingUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  position: number;
};

// Mock data for the ranking
const MOCK_RANKING: RankingUser[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    avatarUrl: "",
    points: 850,
    position: 1
  },
  {
    id: "2",
    name: "Rafaela Souza",
    avatarUrl: "",
    points: 720,
    position: 2
  },
  {
    id: "3",
    name: "Fernando Alves",
    avatarUrl: "",
    points: 690,
    position: 3
  },
  {
    id: "4",
    name: "Juliana Costa",
    avatarUrl: "",
    points: 650,
    position: 4
  },
  {
    id: "5",
    name: "Ricardo Oliveira",
    avatarUrl: "",
    points: 550,
    position: 5
  }
];

export function MonthlyRanking() {
  const getPositionIndicator = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{position}º</span>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Ranking do Mês</CardTitle>
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
          Top 5
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_RANKING.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-3 bg-card hover:bg-accent/10 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getPositionIndicator(user.position)}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{user.name}</div>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {user.points} pts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
