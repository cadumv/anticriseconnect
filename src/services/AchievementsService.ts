
import { Achievement } from "@/types/profile";

export class AchievementsService {
  private static readonly STORAGE_KEY = 'user_achievements';
  
  static getUserAchievements(userId: string): Achievement[] {
    try {
      const achievementsData = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      return achievementsData ? JSON.parse(achievementsData) : [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }
  
  static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving user achievements:', error);
    }
  }
  
  static getUserPoints(userId: string): number {
    const achievements = this.getUserAchievements(userId);
    return achievements
      .filter(achievement => achievement.completed)
      .reduce((total, achievement) => total + achievement.points, 0);
  }
  
  static unlockAchievement(userId: string, achievementId: string): Achievement | null {
    const achievements = this.getUserAchievements(userId);
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex === -1) return null;
    
    const achievement = achievements[achievementIndex];
    if (achievement.completed) return null; // Already completed
    
    // Mark as completed
    achievements[achievementIndex] = {
      ...achievement,
      completed: true
    };
    
    this.saveUserAchievements(userId, achievements);
    return achievements[achievementIndex];
  }
  
  static checkProfileCompletionAchievement(userId: string, profile: any): Achievement | null {
    // Check if profile has all required fields
    const isComplete = profile && 
      profile.name && 
      profile.engineering_type && 
      profile.professional_description &&
      profile.areas_of_expertise && 
      profile.areas_of_expertise.length > 0;
    
    if (isComplete) {
      // Check if achievement exists and is not already completed
      const achievements = this.getUserAchievements(userId);
      const profileAchievement = achievements.find(a => 
        a.id === 'ach-1' && a.category === 'profile' && !a.completed
      );
      
      if (profileAchievement) {
        return this.unlockAchievement(userId, profileAchievement.id);
      }
    }
    
    return null;
  }
  
  static checkFirstPublicationAchievement(userId: string): Achievement | null {
    // This would check if user has published at least one article
    // For demo, we'll just check if the achievement exists and is not completed
    const achievements = this.getUserAchievements(userId);
    const publicationAchievement = achievements.find(a => 
      a.id === 'ach-4' && a.category === 'publication' && !a.completed
    );
    
    if (publicationAchievement) {
      return this.unlockAchievement(userId, publicationAchievement.id);
    }
    
    return null;
  }
}
