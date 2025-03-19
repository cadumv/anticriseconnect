
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";

interface AchievementPopupWrapperProps {
  showAchievementPopup: boolean;
  achievementUnlocked: Achievement | null;
  userName: string;
  onClose: () => void;
  onShare: () => void;
}

export const AchievementPopupWrapper = ({
  showAchievementPopup,
  achievementUnlocked,
  userName,
  onClose,
  onShare
}: AchievementPopupWrapperProps) => {
  if (!achievementUnlocked || !showAchievementPopup) {
    return null;
  }

  return (
    <AchievementPopup
      isOpen={showAchievementPopup}
      onClose={onClose}
      userName={userName}
      achievementTitle={achievementUnlocked.title}
      onShare={onShare}
    />
  );
};
