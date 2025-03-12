
/**
 * Profile-related achievements
 */

import { User } from "@supabase/supabase-js";
import { Achievement } from "@/types/profile";
import { unlockAchievement } from "./utils";

/**
 * Checks if the user has completed their profile and awards an achievement if so
 */
export function checkProfileCompleted(user: User | null): Achievement | null {
  if (!user) return null;
  
  // Check if profile is complete
  const metadata = user.user_metadata || {};
  const isComplete = metadata.name && 
                    metadata.username && 
                    metadata.engineering_type && 
                    metadata.professional_description && 
                    metadata.areas_of_expertise && 
                    metadata.areas_of_expertise.length > 0;
  
  if (isComplete) {
    // Profile completion achievement
    const profileAchievement: Achievement = {
      id: "ach-1",
      title: "Perfil Completo",
      description: "Preencheu todas as informações do perfil",
      icon: "trophy",
      completed: true,
      points: 50,
      category: 'profile'
    };
    
    return unlockAchievement(user.id, profileAchievement);
  }
  
  return null;
}
