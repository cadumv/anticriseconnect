
import { Achievement } from "@/types/profile";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const ACHIEVEMENTS_STORAGE_KEY = 'user_achievements';
const ACHIEVEMENTS_UNLOCKED_KEY = 'achievements_unlocked';

export class AchievementsManager {
  static getUserAchievements(userId: string): Achievement[] {
    try {
      const stored = localStorage.getItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving achievements:', error);
      return [];
    }
  }

  static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    try {
      localStorage.setItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  static getUnlockedAchievements(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${ACHIEVEMENTS_UNLOCKED_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving unlocked achievements:', error);
      return [];
    }
  }

  static saveUnlockedAchievements(userId: string, unlockedIds: string[]): void {
    try {
      localStorage.setItem(`${ACHIEVEMENTS_UNLOCKED_KEY}_${userId}`, JSON.stringify(unlockedIds));
    } catch (error) {
      console.error('Error saving unlocked achievements:', error);
    }
  }

  static checkProfileCompleted(user: User | null): Achievement | null {
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
      // Find the profile completion achievement
      const profileAchievement: Achievement = {
        id: "ach-1",
        title: "Perfil Completo",
        description: "Preencheu todas as informações do perfil",
        icon: "trophy",
        completed: true,
        points: 50,
        category: 'profile'
      };
      
      // Check if already unlocked
      const unlockedAchievements = this.getUnlockedAchievements(user.id);
      if (!unlockedAchievements.includes(profileAchievement.id)) {
        // Mark as unlocked
        unlockedAchievements.push(profileAchievement.id);
        this.saveUnlockedAchievements(user.id, unlockedAchievements);
        
        // Update achievements
        const achievements = this.getUserAchievements(user.id);
        const existingIndex = achievements.findIndex(a => a.id === profileAchievement.id);
        
        if (existingIndex >= 0) {
          achievements[existingIndex] = {...profileAchievement, completed: true};
        } else {
          achievements.push(profileAchievement);
        }
        
        this.saveUserAchievements(user.id, achievements);
        return profileAchievement;
      }
    }
    
    return null;
  }

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
}
