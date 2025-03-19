
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { Achievement } from "@/types/profile";

interface ProfileInfoTabProps {
  user: User;
  isEditingProfile: boolean;
  setIsEditingProfile: (isEditing: boolean) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const ProfileInfoTab = ({ 
  user, 
  isEditingProfile, 
  setIsEditingProfile,
  onAchievementUnlocked
}: ProfileInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>Seus dados profissionais</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditingProfile ? (
          <ProfileForm 
            user={user} 
            setIsEditingProfile={setIsEditingProfile}
            onAchievementUnlocked={onAchievementUnlocked}
          />
        ) : (
          <ProfileInfo user={user} setIsEditingProfile={setIsEditingProfile} />
        )}
      </CardContent>
    </Card>
  );
};
