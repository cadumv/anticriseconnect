
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

  static checkConnectionsAchievement(userId: string): Achievement | null {
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
      
      // Bronze achievement requires 10 connections
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
        
        // Check if already unlocked
        const unlockedAchievements = this.getUnlockedAchievements(userId);
        if (!unlockedAchievements.includes(bronzeConnectionAchievement.id)) {
          // Mark as unlocked
          unlockedAchievements.push(bronzeConnectionAchievement.id);
          this.saveUnlockedAchievements(userId, unlockedAchievements);
          
          // Update achievements
          const achievements = this.getUserAchievements(userId);
          const existingIndex = achievements.findIndex(a => a.id === bronzeConnectionAchievement.id);
          
          if (existingIndex >= 0) {
            achievements[existingIndex] = {...bronzeConnectionAchievement, completed: true};
          } else {
            achievements.push(bronzeConnectionAchievement);
          }
          
          this.saveUserAchievements(userId, achievements);
          return bronzeConnectionAchievement;
        }
      }
    } catch (error) {
      console.error('Error checking connections achievement:', error);
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
