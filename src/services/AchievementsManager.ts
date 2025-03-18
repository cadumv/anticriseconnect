
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
   * Checks for new achievements that need to be shown to the user
   */
  static checkForNewAchievements(userId: string): Achievement | null {
    const shownAchievements = this.getUnlockedAchievements(userId);
    
    // Check for profile achievement
    const profileAchievement = this.checkProfileCompleted({ id: userId });
    if (profileAchievement && !shownAchievements.includes(profileAchievement.id)) {
      // Mark as shown
      shownAchievements.push(profileAchievement.id);
      this.saveUnlockedAchievements(userId, shownAchievements);
      return profileAchievement;
    }
    
    // Check for connections achievement
    const connectionsAchievement = this.checkConnectionsAchievement(userId);
    if (connectionsAchievement && !shownAchievements.includes(connectionsAchievement.id)) {
      shownAchievements.push(connectionsAchievement.id);
      this.saveUnlockedAchievements(userId, shownAchievements);
      return connectionsAchievement;
    }
    
    // Check for first publication achievement
    const publicationAchievement = this.checkFirstPublicationAchievement(userId);
    if (publicationAchievement && !shownAchievements.includes(publicationAchievement.id)) {
      shownAchievements.push(publicationAchievement.id);
      this.saveUnlockedAchievements(userId, shownAchievements);
      return publicationAchievement;
    }
    
    // Check for technical article achievement
    const technicalArticleAchievement = this.checkTechnicalArticleAchievement(userId);
    if (technicalArticleAchievement && !shownAchievements.includes(technicalArticleAchievement.id)) {
      shownAchievements.push(technicalArticleAchievement.id);
      this.saveUnlockedAchievements(userId, shownAchievements);
      return technicalArticleAchievement;
    }
    
    return null;
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
        timestamp: new Date().toISOString(),
        user_id: userId
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
