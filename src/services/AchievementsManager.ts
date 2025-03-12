
/**
 * This file has been refactored into multiple smaller files in the 
 * src/services/achievements/ directory.
 * 
 * This file is kept for backwards compatibility and forwards all calls
 * to the new implementation.
 */

import { Achievement } from "@/types/profile";
import { User } from "@supabase/supabase-js";
import { 
  getUserAchievements as getAchievements,
  saveUserAchievements as saveAchievements,
  getUnlockedAchievements as getUnlocked,
  saveUnlockedAchievements as saveUnlocked,
  checkProfileCompleted as checkProfile,
  checkConnectionsAchievement as checkConnections,
  checkFirstPublicationAchievement as checkPublication,
  shareAchievement as shareAch
} from "./achievements";

export class AchievementsManager {
  static getUserAchievements(userId: string): Achievement[] {
    return getAchievements(userId);
  }

  static saveUserAchievements(userId: string, achievements: Achievement[]): void {
    saveAchievements(userId, achievements);
  }

  static getUnlockedAchievements(userId: string): string[] {
    return getUnlocked(userId);
  }

  static saveUnlockedAchievements(userId: string, unlockedIds: string[]): void {
    saveUnlocked(userId, unlockedIds);
  }

  static checkProfileCompleted(user: User | null): Achievement | null {
    return checkProfile(user);
  }

  static checkConnectionsAchievement(userId: string): Achievement | null {
    return checkConnections(userId);
  }

  static checkFirstPublicationAchievement(userId: string): Achievement | null {
    return checkPublication(userId);
  }

  static shareAchievement(userId: string, achievement: Achievement): void {
    shareAch(userId, achievement);
  }
}
