
/**
 * Publication-related achievements
 */

import { Achievement } from "@/types/profile";
import { unlockAchievement, shareAchievement } from "./utils";
import { updatePublicationMissionProgress, updateKnowledgeMissionProgress } from "@/components/achievements/utils/missionUtils";
import { toast } from "@/hooks/use-toast";

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
        // Award the achievement
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

/**
 * Checks if the user has published their first technical article
 */
export function checkTechnicalArticleAchievement(userId: string): Achievement | null {
  try {
    // Check user publications
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      
      // If user has at least one technical article
      const hasTechnicalArticle = parsedPublications && 
        parsedPublications.some((pub: any) => pub.type === 'technical_article');
      
      if (hasTechnicalArticle) {
        // Update mission progress
        updateKnowledgeMissionProgress(userId);
        
        // Award the achievement
        const technicalArticleAchievement: Achievement = {
          id: "ach-knowledge",
          title: "Compartilhador de Conhecimento",
          description: "Publicou um artigo técnico para ajudar outros engenheiros",
          icon: "book-open",
          completed: true,
          points: 125,
          category: 'publication'
        };
        
        return unlockAchievement(userId, technicalArticleAchievement);
      }
    }
  } catch (error) {
    console.error('Error checking technical article achievement:', error);
  }
  
  return null;
}
