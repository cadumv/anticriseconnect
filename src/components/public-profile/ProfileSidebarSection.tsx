
import { Achievement } from "@/types/profile";
import { AchievementsSidebar } from "@/components/achievements/AchievementsSidebar";
import { ProfileSuggestions } from "@/components/profile/sections/ProfileSuggestions";

interface ProfileSidebarSectionProps {
  achievements?: Achievement[];
  totalPoints: number;
}

export const ProfileSidebarSection = ({
  achievements = [],
  totalPoints
}: ProfileSidebarSectionProps) => {
  return (
    <div className="space-y-4">
      <AchievementsSidebar 
        achievements={achievements} 
        totalPoints={totalPoints} 
      />
      <ProfileSuggestions />
    </div>
  );
};
