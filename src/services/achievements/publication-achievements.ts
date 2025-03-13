
/**
 * Publication-related achievements
 */

import { Achievement } from "@/types/profile";
import { unlockAchievement, shareAchievement } from "./utils";
import { updatePublicationMissionProgress } from "@/components/achievements/utils/missionUtils";
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
        // Update mission progress
        const missionResult = updatePublicationMissionProgress(userId);
        
        // Show mission completed notification
        if (missionResult.missionCompleted) {
          toast({
            title: "Missão Completa!",
            description: "Você completou a missão 'Apresente seus serviços ou área de atuação' e ganhou 75 pontos!",
            variant: "default",
          });
        }
        
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
