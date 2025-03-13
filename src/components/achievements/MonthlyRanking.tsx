
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function MonthlyRanking() {
  const { user } = useAuth();
  
  // Se não houver usuário, não exibe o ranking
  if (!user) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Ranking de Engenharia</CardTitle>
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
          Top Engenheiros
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-card hover:bg-accent/10 transition-colors rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.user_metadata?.name || "Usuário"} />
                <AvatarFallback>{(user.user_metadata?.name || "Usuário").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{user.user_metadata?.name || "Usuário Teste"}</div>
            </div>
            <Badge variant="secondary" className="ml-auto">
              1º Lugar
            </Badge>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>Você está liderando o ranking! Continue completando missões para acumular mais pontos.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
