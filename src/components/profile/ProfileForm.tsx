
import { User } from "@supabase/supabase-js";
import { ProfileFormContainer } from "./ProfileFormContainer";
import { Achievement } from "@/types/profile";

interface ProfileFormProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const ProfileForm = ({ user, setIsEditingProfile, onAchievementUnlocked }: ProfileFormProps) => {
  return (
    <ProfileFormContainer
      user={user}
      setIsEditingProfile={setIsEditingProfile}
      onAchievementUnlocked={onAchievementUnlocked}
    />
  );
};
