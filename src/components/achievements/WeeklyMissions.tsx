
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MissionItem } from "./MissionItem";
import { useMissions } from "./hooks/useMissions";

export function WeeklyMissions() {
  const { user } = useAuth();
  const { missions, handleClaimReward } = useMissions(user?.id);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Missões Anticrise</CardTitle>
        <Badge variant="outline" className="ml-2 px-3 py-1">
          Recompensas disponíveis
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma missão disponível no momento</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
