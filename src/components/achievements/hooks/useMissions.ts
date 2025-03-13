
import { useEffect, useState } from "react";
import { Mission } from "../types/mission";
import { canAddKnowledgeMission, createNewKnowledgeMission, getDefaultMissions, isPreviousMissionCompleted } from "../utils/missionUtils";

export function useMissions(userId: string | undefined) {
  const [missions, setMissions] = useState<Mission[]>([]);
  
  useEffect(() => {
    if (!userId) return;
    
    // Retrieve missions data from localStorage
    const missionsKey = `user_missions_${userId}`;
    const savedMissions = localStorage.getItem(missionsKey);
    
    if (savedMissions) {
      try {
        let parsedMissions = JSON.parse(savedMissions) as Mission[];
        
        // Filter missions based on their sequence and completion status
        parsedMissions = parsedMissions.filter(mission => 
          !mission.sequence || isPreviousMissionCompleted(parsedMissions, mission.sequence)
        );
        
        setMissions(parsedMissions);
      } catch (error) {
        console.error("Error parsing missions:", error);
        // Initialize with default missions if there's an error
        const defaultMissions = getDefaultMissions();
        setMissions(defaultMissions);
        localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
      }
    } else {
      // If no missions exist yet, create default missions
      const defaultMissions = getDefaultMissions();
      setMissions(defaultMissions);
      
      // Save default missions to localStorage
      localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
    }
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
