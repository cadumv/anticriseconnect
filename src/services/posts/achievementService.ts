
import { AchievementsManager } from "@/services/AchievementsManager";

type PostType = 'post' | 'technical_article' | 'service' | 'opportunity';

/**
 * Checks for achievements based on post creation
 */
export const checkPostAchievements = (userId: string, postType: PostType) => {
  // Check for first publication achievement
  const firstPublicationAchievement = AchievementsManager.checkFirstPublicationAchievement(userId);
  if (firstPublicationAchievement) {
    const shownAchievements = AchievementsManager.getUnlockedAchievements(userId);
    if (!shownAchievements.includes(firstPublicationAchievement.id)) {
      shownAchievements.push(firstPublicationAchievement.id);
      AchievementsManager.saveUnlockedAchievements(userId, shownAchievements);
    }
  }
  
  // Check for post-type specific achievements
  if (postType === 'technical_article') {
    const technicalArticleAchievement = AchievementsManager.checkTechnicalArticleAchievement(userId);
    if (technicalArticleAchievement) {
      const shownAchievements = AchievementsManager.getUnlockedAchievements(userId);
      if (!shownAchievements.includes(technicalArticleAchievement.id)) {
        shownAchievements.push(technicalArticleAchievement.id);
        AchievementsManager.saveUnlockedAchievements(userId, shownAchievements);
      }
    }
  }
};
