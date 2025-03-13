
import { Mission } from "../../types/mission";
import { getConnectionCount, getServicePublicationCount, getTechnicalArticlesCount } from "./missionCounts";

/**
 * Update connection mission progress
 */
export const updateConnectionMissionProgress = (userId: string): { 
  currentProgress: number;
  requiredProgress: number;
  missionCompleted: boolean;
} => {
  const missionsKey = `user_missions_${userId}`;
  const missionsData = localStorage.getItem(missionsKey);
  
  if (!missionsData) {
    return { currentProgress: 0, requiredProgress: 20, missionCompleted: false };
  }
  
  const missions = JSON.parse(missionsData);
  const connectionMission = missions.find((m: Mission) => m.id === "mission-connections");
  
  if (!connectionMission) {
    return { currentProgress: 0, requiredProgress: 20, missionCompleted: false };
  }
  
  // Count connections
  const connectionCount = getConnectionCount(userId);
  const requiredProgress = connectionMission.requiredProgress;
  const currentProgress = Math.min(connectionCount, requiredProgress);
  const wasAlreadyCompleted = connectionMission.completed;
  
  // Check if mission was just completed
  const justCompleted = !wasAlreadyCompleted && connectionCount >= requiredProgress;
  
  // Update mission status
  if (connectionCount > connectionMission.currentProgress || justCompleted) {
    const updatedMissions = missions.map((mission: Mission) => {
      if (mission.id === "mission-connections") {
        return {
          ...mission,
          currentProgress: currentProgress,
          completed: connectionCount >= requiredProgress,
          completedDate: justCompleted ? new Date().toISOString() : mission.completedDate
        };
      }
      return mission;
    });
    
    localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
  }
  
  return { 
    currentProgress, 
    requiredProgress, 
    missionCompleted: justCompleted 
  };
};

/**
 * Update knowledge mission progress for technical articles
 */
export const updateKnowledgeMissionProgress = (userId: string): { 
  currentProgress: number;
  requiredProgress: number;
  missionCompleted: boolean;
} => {
  const missionsKey = `user_missions_${userId}`;
  const missionsData = localStorage.getItem(missionsKey);
  
  if (!missionsData) {
    return { currentProgress: 0, requiredProgress: 1, missionCompleted: false };
  }
  
  const missions = JSON.parse(missionsData);
  const knowledgeMission = missions.find((m: Mission) => m.id === "mission-knowledge");
  
  if (!knowledgeMission) {
    return { currentProgress: 0, requiredProgress: 1, missionCompleted: false };
  }
  
  // Count technical articles
  const technicalArticlesCount = getTechnicalArticlesCount(userId);
  const requiredProgress = knowledgeMission.requiredProgress;
  const currentProgress = Math.min(technicalArticlesCount, requiredProgress);
  const wasAlreadyCompleted = knowledgeMission.completed;
  
  // Check if mission was just completed
  const justCompleted = !wasAlreadyCompleted && technicalArticlesCount >= requiredProgress;
  
  // Update mission status
  if (technicalArticlesCount > knowledgeMission.currentProgress || justCompleted) {
    const updatedMissions = missions.map((mission: Mission) => {
      if (mission.id === "mission-knowledge") {
        return {
          ...mission,
          currentProgress: currentProgress,
          completed: technicalArticlesCount >= requiredProgress,
          completedDate: justCompleted ? new Date().toISOString() : mission.completedDate
        };
      }
      return mission;
    });
    
    localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
  }
  
  return { 
    currentProgress, 
    requiredProgress, 
    missionCompleted: justCompleted 
  };
};

/**
 * Update publication mission progress - only count service publications
 */
export const updatePublicationMissionProgress = (userId: string): { 
  currentProgress: number;
  requiredProgress: number;
  missionCompleted: boolean;
} => {
  const missionsKey = `user_missions_${userId}`;
  const missionsData = localStorage.getItem(missionsKey);
  
  if (!missionsData) {
    return { currentProgress: 0, requiredProgress: 1, missionCompleted: false };
  }
  
  const missions = JSON.parse(missionsData);
  const publicationMission = missions.find((m: Mission) => m.id === "mission-publication");
  
  if (!publicationMission) {
    return { currentProgress: 0, requiredProgress: 1, missionCompleted: false };
  }
  
  // Count service publications
  const servicePublicationCount = getServicePublicationCount(userId);
  const requiredProgress = publicationMission.requiredProgress;
  const currentProgress = Math.min(servicePublicationCount, requiredProgress);
  const wasAlreadyCompleted = publicationMission.completed;
  
  // Check if mission was just completed
  const justCompleted = !wasAlreadyCompleted && servicePublicationCount >= requiredProgress;
  
  // Update mission status
  if (servicePublicationCount > publicationMission.currentProgress || justCompleted) {
    const updatedMissions = missions.map((mission: Mission) => {
      if (mission.id === "mission-publication") {
        return {
          ...mission,
          currentProgress: currentProgress,
          completed: servicePublicationCount >= requiredProgress,
          completedDate: justCompleted ? new Date().toISOString() : mission.completedDate
        };
      }
      return mission;
    });
    
    localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
  }
  
  return { 
    currentProgress, 
    requiredProgress, 
    missionCompleted: justCompleted 
  };
};
