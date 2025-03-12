
/**
 * Storage utilities for achievements
 */

const ACHIEVEMENTS_STORAGE_KEY = 'user_achievements';
const ACHIEVEMENTS_UNLOCKED_KEY = 'achievements_unlocked';

import { Achievement } from "@/types/profile";

export function getUserAchievements(userId: string): Achievement[] {
  try {
    const stored = localStorage.getItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving achievements:', error);
    return [];
  }
}

export function saveUserAchievements(userId: string, achievements: Achievement[]): void {
  try {
    localStorage.setItem(`${ACHIEVEMENTS_STORAGE_KEY}_${userId}`, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
}

export function getUnlockedAchievements(userId: string): string[] {
  try {
    const stored = localStorage.getItem(`${ACHIEVEMENTS_UNLOCKED_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving unlocked achievements:', error);
    return [];
  }
}

export function saveUnlockedAchievements(userId: string, unlockedIds: string[]): void {
  try {
    localStorage.setItem(`${ACHIEVEMENTS_UNLOCKED_KEY}_${userId}`, JSON.stringify(unlockedIds));
  } catch (error) {
    console.error('Error saving unlocked achievements:', error);
  }
}
