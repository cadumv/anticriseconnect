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
      
      const updatedMissions = [...defaultMissions];
      
      // Update profile mission if complete
      if (isProfileComplete) {
        updatedMissions[0] = {
          ...updatedMissions[0],
          currentProgress: updatedMissions[0].requiredProgress,
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

// Helper function to count user connections
function getConnectionCount(userId: string): number {
  let connectionCount = 0;
  
  try {
    // Check connections made by the user
    const userConnectionKey = `connection_requests_${userId}`;
    const userRequests = localStorage.getItem(userConnectionKey);
    
    if (userRequests) {
      const parsedUserRequests = JSON.parse(userRequests);
      // Count accepted connection requests
      connectionCount += parsedUserRequests.filter((request: any) => 
        request.status === 'accepted'
      ).length;
    }
    
    // Check connections received by the user
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    
    for (const otherUserId of allUsers) {
      if (otherUserId === userId) continue;
      
      const connectionKey = `connection_requests_${otherUserId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const acceptedRequests = requests.filter((req: any) => 
          req.targetId === userId && req.status === 'accepted'
        );
        
        connectionCount += acceptedRequests.length;
      }
    }
    
    console.log(`User ${userId} has ${connectionCount} connections`);
    
    return connectionCount;
  } catch (error) {
    console.error('Error counting connections:', error);
    return 0;
  }
}

// Helper function to count user technical articles
function getTechnicalArticlesCount(userId: string): number {
  try {
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      if (Array.isArray(parsedPublications)) {
        return parsedPublications.filter(pub => pub.type === 'technical_article').length;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting technical articles:', error);
    return 0;
  }
}

// Helper function to count user service publications
function getServicePublicationCount(userId: string): number {
  try {
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      if (Array.isArray(parsedPublications)) {
        return parsedPublications.filter(pub => pub.type === 'service').length;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting service publications:', error);
    return 0;
  }
}

// Standard publication count for backward compatibility
function getPublicationCount(userId: string): number {
  try {
    // Check user publications
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      return Array.isArray(parsedPublications) ? parsedPublications.length : 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting publications:', error);
    return 0;
  }
}
