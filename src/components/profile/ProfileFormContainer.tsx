
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

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface Experience {
  company: string;
  position: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
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

  // Education, Experience and Interests
  const [education, setEducation] = useState<Education[]>(
    user?.user_metadata?.education || []
  );
  const [experiences, setExperiences] = useState<Experience[]>(
    user?.user_metadata?.experiences || []
  );
  const [interests, setInterests] = useState<string[]>(
    user?.user_metadata?.interests || []
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
    education,
    experiences,
    interests,
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
          education={education}
          setEducation={setEducation}
          experiences={experiences}
          setExperiences={setExperiences}
          interests={interests}
          setInterests={setInterests}
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
