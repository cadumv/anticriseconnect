
/**
 * Connection-related achievements
 */

import { Achievement } from "@/types/profile";
import { unlockAchievement } from "./utils";

/**
 * Checks the user's connections and awards appropriate achievements
 */
export function checkConnectionsAchievement(userId: string): Achievement | null {
  // Check user connections count
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
    
    // Silver achievement check - 50 connections
    if (connectionCount >= 50) {
      const silverConnectionAchievement: Achievement = {
        id: "ach-3",
        title: "Conexões Anticrise - Prata",
        description: "Realizou 50 conexões com avaliação positiva",
        icon: "medal",
        completed: true,
        points: 250,
        category: 'connection',
        level: 'silver'
      };
      
      return unlockAchievement(userId, silverConnectionAchievement);
    }
    
    // Bronze achievement check - 10 connections
    if (connectionCount >= 10) {
      const bronzeConnectionAchievement: Achievement = {
        id: "ach-2",
        title: "Conexões Anticrise - Bronze",
        description: "Realizou 10 conexões com avaliação positiva",
        icon: "medal",
        completed: true,
        points: 100,
        category: 'connection',
        level: 'bronze'
      };
      
      return unlockAchievement(userId, bronzeConnectionAchievement);
    }
  } catch (error) {
    console.error('Error checking connections achievement:', error);
  }
  
  return null;
}
