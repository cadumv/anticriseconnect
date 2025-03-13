
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mission } from "./types/mission";

interface MissionItemProps {
  mission: Mission;
  onClaimReward: (missionId: string) => void;
}

export function MissionItem({ mission, onClaimReward }: MissionItemProps) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{mission.title}</h3>
          <p className="text-sm text-muted-foreground">{mission.description}</p>
        </div>
        <Badge variant="secondary" className="px-2">{mission.points} pts</Badge>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso</span>
          <span>
            {mission.currentProgress}/{mission.requiredProgress}
          </span>
        </div>
        <Progress 
          value={(mission.currentProgress / mission.requiredProgress) * 100} 
          className="h-2"
        />
      </div>
      {mission.currentProgress >= mission.requiredProgress && !mission.claimed && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 w-full" 
          onClick={() => onClaimReward(mission.id)}
        >
          Resgatar recompensa
        </Button>
      )}
    </div>
  );
}
