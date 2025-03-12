
/**
 * Main achievements service
 */

// Storage functions
export { 
  getUserAchievements,
  saveUserAchievements,
  getUnlockedAchievements,
  saveUnlockedAchievements
} from './storage';

// Utility functions
export { shareAchievement } from './utils';

// Achievement checkers
export { checkProfileCompleted } from './profile-achievements';
export { checkConnectionsAchievement } from './connection-achievements';
export { checkFirstPublicationAchievement } from './publication-achievements';

/**
 * Main AchievementsManager class that provides a backwards-compatible API
 * to maintain compatibility with existing code
 */
import { Achievement } from "@/types/profile";
import { User } from "@supabase/supabase-js";
import * as ProfileAchievements from './profile-achievements';
import * as ConnectionAchievements from './connection-achievements';
import * as PublicationAchievements from './publication-achievements';
import * as AchievementStorage from './storage';
import * as AchievementUtils from './utils';

export class AchievementsManager {
  static getUserAchievements(userId: string): Achievement[] {
    return AchievementStorage.getUserAchievements(userId);
  }

  static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    AchievementStorage.saveUserAchievements(userId, achievements);
  }

  static getUnlockedAchievements(userId: string): string[] {
    return AchievementStorage.getUnlockedAchievements(userId);
  }

  static saveUnlockedAchievements(userId: string, unlockedIds: string[]): void {
    AchievementStorage.saveUnlockedAchievements(userId, unlockedIds);
  }

  static checkProfileCompleted(user: User | null): Achievement | null {
    return ProfileAchievements.checkProfileCompleted(user);
  }

  static checkConnectionsAchievement(userId: string): Achievement | null {
    return ConnectionAchievements.checkConnectionsAchievement(userId);
  }

  static checkFirstPublicationAchievement(userId: string): Achievement | null {
    return PublicationAchievements.checkFirstPublicationAchievement(userId);
  }

  static shareAchievement(userId: string, achievement: Achievement): void {
    AchievementUtils.shareAchievement(userId, achievement);
  }
}
