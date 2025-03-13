
import { useEffect, useState } from "react";
import { Mission } from "../types/mission";
import { canAddKnowledgeMission, createNewKnowledgeMission, getDefaultMissions, isPreviousMissionCompleted } from "../utils/missionUtils";
import { useAuth } from "@/hooks/useAuth";

export function useMissions(userId: string | undefined) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!userId) return;
    
    // Retrieve missions data from localStorage
    const missionsKey = `user_missions_${userId}`;
    
    // Get default missions
    const defaultMissions = getDefaultMissions();
    
    // Check if profile is complete to mark the profile mission
    if (user) {
      const metadata = user.user_metadata || {};
      const isProfileComplete = metadata.name && 
                      metadata.username && 
                      metadata.engineering_type && 
                      metadata.professional_description && 
                      metadata.areas_of_expertise && 
                      metadata.areas_of_expertise.length > 0;
      
      if (isProfileComplete) {
        const updatedMissions = defaultMissions.map(mission => {
          if (mission.id === "mission-profile") {
            return {
              ...mission,
              currentProgress: mission.requiredProgress,
              completed: true
            };
          }
          return mission;
        });
        
        setMissions(updatedMissions);
        localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
        return;
      }
    }
    
    // If profile not complete, use default missions
    setMissions(defaultMissions);
    localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
  }, [userId, user]);
  
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
