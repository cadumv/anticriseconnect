
/**
 * Utility functions for achievements
 */

import { Achievement } from "@/types/profile";
import { toast } from "@/hooks/use-toast";
import { getUserAchievements, getUnlockedAchievements, saveUnlockedAchievements, saveUserAchievements } from "./storage";

/**
 * Updates a user's achievements when they unlock a new one
 */
export function unlockAchievement(userId: string, achievement: Achievement): Achievement | null {
  // Check if already unlocked
  const unlockedAchievements = getUnlockedAchievements(userId);
  if (unlockedAchievements.includes(achievement.id)) {
    return null;
  }
  
  // Mark as unlocked
  unlockedAchievements.push(achievement.id);
  saveUnlockedAchievements(userId, unlockedAchievements);
  
  // Update achievements
  const achievements = getUserAchievements(userId);
  const existingIndex = achievements.findIndex(a => a.id === achievement.id);
  
  if (existingIndex >= 0) {
    achievements[existingIndex] = {...achievement, completed: true};
  } else {
    achievements.push(achievement);
  }
  
  saveUserAchievements(userId, achievements);
  return achievement;
}

/**
 * Shares an achievement to the user's feed
 */
export function shareAchievement(userId: string, achievement: Achievement): void {
  // This would normally post to a database
  // For now we'll just store in localStorage for demo
  try {
    const postsKey = `user_posts_${userId}`;
    const existingPosts = localStorage.getItem(postsKey);
    const posts = existingPosts ? JSON.parse(existingPosts) : [];
    
    posts.unshift({
      id: `post-${Date.now()}`,
      content: `🏆 Desbloqueei a conquista: ${achievement.title} (${achievement.points} pontos)`,
      type: 'achievement',
      achievementId: achievement.id,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(postsKey, JSON.stringify(posts));
    toast({
      title: "Conquista compartilhada",
      description: "Sua conquista foi compartilhada em seu perfil!"
    });
  } catch (error) {
    console.error('Error sharing achievement:', error);
    toast({
      title: "Erro ao compartilhar",
      description: "Não foi possível compartilhar sua conquista",
      variant: "destructive"
    });
  }
}
