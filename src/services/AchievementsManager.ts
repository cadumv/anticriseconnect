import { Achievement } from "@/types/profile";
import { checkProfileCompleted } from "./achievements/profile-achievements";
import { checkConnectionsAchievement } from "./achievements/connection-achievements";
import { getUserAchievements, saveUserAchievements, getUnlockedAchievements, saveUnlockedAchievements } from "./achievements/storage";
// Import the new achievement check
import { checkFirstPublicationAchievement, checkTechnicalArticleAchievement } from "./achievements/publication-achievements";

export class AchievementsManager {
  /**
   * Retrieves a user's achievements from localStorage
   */
  static getUserAchievements(userId: string): Achievement[] {
    return getUserAchievements(userId);
  }

  /**
   * Saves a user's achievements to localStorage
   */
  static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    saveUserAchievements(userId, achievements);
  }

  /**
   * Retrieves a user's unlocked achievements from localStorage
   */
  static getUnlockedAchievements(userId: string): string[] {
    return getUnlockedAchievements(userId);
  }

  /**
   * Saves a user's unlocked achievements to localStorage
   */
  static saveUnlockedAchievements(userId: string, achievementIds: string[]): void {
    saveUnlockedAchievements(userId, achievementIds);
  }

  /**
   * Checks if the user has completed their profile and awards an achievement if so
   */
  static checkProfileCompleted(user: any): Achievement | null {
    return checkProfileCompleted(user);
  }

  /**
   * Checks if the user has reached the required number of connections and awards an achievement if so
   */
  static checkConnectionsAchievement(userId: string): Achievement | null {
    return checkConnectionsAchievement(userId);
  }

  /**
   * Shares an achievement to the user's feed
   */
  static shareAchievement(userId: string, achievement: Achievement): void {
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
    } catch (error) {
      console.error('Error sharing achievement:', error);
    }
  }
  
  /**
   * Checks for first publication achievement
   */
  static checkFirstPublicationAchievement(userId: string): Achievement | null {
    return checkFirstPublicationAchievement(userId);
  }
  
  /**
   * Checks for technical article achievement
   */
  static checkTechnicalArticleAchievement(userId: string): Achievement | null {
    return checkTechnicalArticleAchievement(userId);
  }
}
