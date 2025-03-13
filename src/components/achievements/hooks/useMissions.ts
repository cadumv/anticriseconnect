
import { useEffect, useState } from "react";
import { Mission } from "../types/mission";
import { canAddKnowledgeMission, createNewKnowledgeMission, getDefaultMissions, isPreviousMissionCompleted } from "../utils/missionUtils";

export function useMissions(userId: string | undefined) {
  const [missions, setMissions] = useState<Mission[]>([]);
  
  useEffect(() => {
    if (!userId) return;
    
    // Retrieve missions data from localStorage
    const missionsKey = `user_missions_${userId}`;
    
    // Clear any existing missions data and set to empty array
    localStorage.setItem(missionsKey, JSON.stringify([]));
    setMissions([]);
    
  }, [userId]);
  
  const handleClaimReward = (missionId: string) => {
    if (!userId) return;
    
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && mission.currentProgress >= mission.requiredProgress) {
        // Mark as claimed and completed
        return { 
          ...mission, 
          claimed: true, 
          completed: true,
          completedDate: new Date().toISOString()
        };
      }
      return mission;
    });
    
    setMissions(updatedMissions);
    localStorage.setItem(`user_missions_${userId}`, JSON.stringify(updatedMissions));
  };
  
  return { missions, handleClaimReward };
}
