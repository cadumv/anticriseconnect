
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
        
        // Check if we should add a new knowledge sharing mission
        if (canAddKnowledgeMission(parsedMissions)) {
          // Only add if it's been a week since the last one was completed
          const latestKnowledgeMission = parsedMissions
            .filter(m => m.id.startsWith("mission-knowledge") && m.completed)
            .sort((a, b) => {
              const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
              const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
              return dateB - dateA;
            })[0];
          
          const shouldAddNewMission = !latestKnowledgeMission || 
            (latestKnowledgeMission.completedDate &&
            Date.now() - new Date(latestKnowledgeMission.completedDate).getTime() >= 7 * 24 * 60 * 60 * 1000);
          
          if (shouldAddNewMission) {
            parsedMissions.push(createNewKnowledgeMission(parsedMissions));
            localStorage.setItem(missionsKey, JSON.stringify(parsedMissions));
          }
        }
        
        // Filter missions based on their sequence and completion status
        parsedMissions = parsedMissions.filter(mission => 
          !mission.sequence || isPreviousMissionCompleted(parsedMissions, mission.sequence)
        );
        
        setMissions(parsedMissions);
      } catch (error) {
        console.error("Error parsing missions:", error);
        // Initialize with empty missions if there's an error
        setMissions([]);
      }
    } else {
      // If no missions exist yet, create default missions (now empty)
      const defaultMissions = getDefaultMissions();
      setMissions(defaultMissions);
      
      // Save empty missions to localStorage
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
