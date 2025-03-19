
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import { useProfileFormSubmit } from "@/hooks/useProfileFormSubmit";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { ProfileFormActions } from "./ProfileFormActions";
import { Label } from "@/components/ui/label";
import { Achievement } from "@/types/profile";

interface ProfileFormContainerProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const ProfileFormContainer = ({ 
  user, 
  setIsEditingProfile, 
  onAchievementUnlocked 
}: ProfileFormContainerProps) => {
  // Personal information
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  
  // Professional information
  const [engineeringType, setEngineeringType] = useState(user?.user_metadata?.engineering_type || "");
  const [professionalDescription, setProfessionalDescription] = useState(
    user?.user_metadata?.professional_description || ""
  );
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>(
    user?.user_metadata?.areas_of_expertise || ["", "", ""]
  );
  
  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");

  // Username validation
  const { usernameError, usernameAvailable } = useUsernameAvailability({ 
    username, 
    user 
  });

  const updateAreasOfExpertise = (index: number, value: string) => {
    const updatedAreas = [...areasOfExpertise];
    updatedAreas[index] = value;
    setAreasOfExpertise(updatedAreas);
  };

  const { loading, handleSubmit } = useProfileFormSubmit({
    user,
    name,
    username, 
    phone,
    engineeringType,
    professionalDescription,
    areasOfExpertise,
    avatarUrl,
    setIsEditingProfile,
    usernameAvailable,
    onAchievementUnlocked
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="avatar">Foto de perfil</Label>
          <ProfileAvatar 
            userId={user.id} 
            avatarUrl={avatarUrl} 
            setAvatarUrl={setAvatarUrl} 
          />
        </div>

        <PersonalInfoFields
          user={user}
          name={name}
          setName={setName}
          username={username}
          setUsername={setUsername}
          usernameError={usernameError}
          phone={phone}
          setPhone={setPhone}
        />
        
        <ProfessionalInfoFields
          engineeringType={engineeringType}
          setEngineeringType={setEngineeringType}
          areasOfExpertise={areasOfExpertise}
          updateAreasOfExpertise={updateAreasOfExpertise}
          professionalDescription={professionalDescription}
          setProfessionalDescription={setProfessionalDescription}
        />
        
        <ProfileFormActions
          loading={loading}
          isFormValid={usernameAvailable}
          onCancel={() => setIsEditingProfile(false)}
        />
      </div>
    </form>
  );
};
