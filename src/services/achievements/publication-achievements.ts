
/**
 * Publication-related achievements
 */

import { Achievement } from "@/types/profile";
import { unlockAchievement } from "./utils";

/**
 * Checks if the user has published their first article and awards an achievement if so
 */
export function checkFirstPublicationAchievement(userId: string): Achievement | null {
  try {
    // Check user publications
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      
      // If user has at least one publication
      if (parsedPublications && parsedPublications.length > 0) {
        const firstPublicationAchievement: Achievement = {
          id: "ach-4",
          title: "Primeiro Artigo",
          description: "Publicou seu primeiro artigo técnico",
          icon: "file-text",
          completed: true,
          points: 100,
          category: 'publication'
        };
        
        return unlockAchievement(userId, firstPublicationAchievement);
      }
    }
  } catch (error) {
    console.error('Error checking first publication achievement:', error);
  }
  
  return null;
}
