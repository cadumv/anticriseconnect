
import { useEffect, useState } from "react";
import { Mission } from "../types/mission";
import { 
  getDefaultMissions, 
  getConnectionCount, 
  getTechnicalArticlesCount, 
  getServicePublicationCount 
} from "../utils/missions";
import { useAuth } from "@/hooks/useAuth";

export function useMissions(userId: string | undefined) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!userId) return;
    
    // Retrieve missions data from localStorage
    const missionsKey = `user_missions_${userId}`;
    const storedMissions = localStorage.getItem(missionsKey);
    
    // Get default missions
    const defaultMissions = getDefaultMissions();
    
    // Initialize with stored data or default missions
    let initialMissions = storedMissions ? JSON.parse(storedMissions) : defaultMissions;
    
    // Check if profile is complete to mark the profile mission
    if (user) {
      const metadata = user.user_metadata || {};
      const isProfileComplete = metadata.name && 
                      metadata.username && 
                      metadata.engineering_type && 
                      metadata.professional_description && 
                      metadata.areas_of_expertise && 
                      metadata.areas_of_expertise.length > 0;
      
      const updatedMissions = [...initialMissions];
      
      // Update profile mission if complete
      const profileMissionIndex = updatedMissions.findIndex(m => m.id === "mission-profile");
      if (profileMissionIndex !== -1 && isProfileComplete) {
        updatedMissions[profileMissionIndex] = {
          ...updatedMissions[profileMissionIndex],
          currentProgress: updatedMissions[profileMissionIndex].requiredProgress,
          completed: true
        };
      }
      
      // Update connection mission progress
      const connectionMissionIndex = updatedMissions.findIndex(m => m.id === "mission-connections");
      if (connectionMissionIndex !== -1) {
        const connectionCount = getConnectionCount(userId);
        
        updatedMissions[connectionMissionIndex] = {
          ...updatedMissions[connectionMissionIndex],
          currentProgress: Math.min(connectionCount, updatedMissions[connectionMissionIndex].requiredProgress),
          completed: connectionCount >= updatedMissions[connectionMissionIndex].requiredProgress
        };
      }
      
      // Check if user has made any service publications
      const publicationMissionIndex = updatedMissions.findIndex(m => m.id === "mission-publication");
      if (publicationMissionIndex !== -1) {
        const publicationCount = getServicePublicationCount(userId);
        
        updatedMissions[publicationMissionIndex] = {
          ...updatedMissions[publicationMissionIndex],
          currentProgress: Math.min(publicationCount, updatedMissions[publicationMissionIndex].requiredProgress),
          completed: publicationCount >= updatedMissions[publicationMissionIndex].requiredProgress,
          completedDate: publicationCount >= updatedMissions[publicationMissionIndex].requiredProgress ? 
                          updatedMissions[publicationMissionIndex].completedDate || new Date().toISOString() : 
                          undefined
        };
      }
      
      // Check if user has made any technical articles 
      const knowledgeMissionIndex = updatedMissions.findIndex(m => m.id === "mission-knowledge");
      if (knowledgeMissionIndex !== -1) {
        const technicalArticlesCount = getTechnicalArticlesCount(userId);
        
        updatedMissions[knowledgeMissionIndex] = {
          ...updatedMissions[knowledgeMissionIndex],
          currentProgress: Math.min(technicalArticlesCount, updatedMissions[knowledgeMissionIndex].requiredProgress),
          completed: technicalArticlesCount >= updatedMissions[knowledgeMissionIndex].requiredProgress,
          completedDate: technicalArticlesCount >= updatedMissions[knowledgeMissionIndex].requiredProgress ? 
                          updatedMissions[knowledgeMissionIndex].completedDate || new Date().toISOString() : 
                          undefined
        };
      }
      
      // Preserve claimed status for missions that were previously claimed
      if (storedMissions) {
        const previousMissions = JSON.parse(storedMissions);
        updatedMissions.forEach((mission, index) => {
          const prevMission = previousMissions.find((m: Mission) => m.id === mission.id);
          if (prevMission && prevMission.claimed) {
            updatedMissions[index].claimed = true;
          }
        });
      }
      
      setMissions(updatedMissions);
      localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
      return;
    }
    
    // If user not available, use default missions
    setMissions(defaultMissions);
    localStorage.setItem(missionsKey, JSON.stringify(defaultMissions));
  }, [userId, user]);
  
  const handleClaimReward = (missionId: string) => {
    if (!userId) return;
    
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && mission.currentProgress >= mission.requiredProgress && !mission.claimed) {
        // Mark as claimed and completed
        return { 
          ...mission, 
          claimed: true, 
          completed: true,
          completedDate: mission.completedDate || new Date().toISOString()
        };
      }
      return mission;
    });
    
    setMissions(updatedMissions);
    localStorage.setItem(`user_missions_${userId}`, JSON.stringify(updatedMissions));
  };
  
  return { missions, handleClaimReward };
}
