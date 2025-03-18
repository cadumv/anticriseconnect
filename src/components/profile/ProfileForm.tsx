
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { ProfileFormActions } from "./ProfileFormActions";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import { Label } from "@/components/ui/label";
import { Achievement } from "@/types/profile";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Mission } from "../achievements/types/mission";

interface ProfileFormProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const ProfileForm = ({ user, setIsEditingProfile, onAchievementUnlocked }: ProfileFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
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

  const updateProfileMission = () => {
    if (!user) return;
    
    // Check if profile is now complete
    const isProfileComplete = name && username && engineeringType && 
      professionalDescription && areasOfExpertise.filter(a => a.trim() !== "").length > 0;
    
    if (isProfileComplete) {
      // Update mission in localStorage
      const missionsKey = `user_missions_${user.id}`;
      const savedMissions = localStorage.getItem(missionsKey);
      
      if (savedMissions) {
        const missions = JSON.parse(savedMissions) as Mission[];
        const updatedMissions = missions.map(mission => {
          if (mission.id === "mission-profile" && mission.currentProgress < mission.requiredProgress) {
            return {
              ...mission,
              currentProgress: mission.requiredProgress,
              completed: true
            };
          }
          return mission;
        });
        
        localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
      }
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameAvailable) {
      toast({
        title: "Nome de usuário indisponível",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Filtrar áreas de expertise vazias
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          username,
          phone, 
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          avatar_url: avatarUrl
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table with the username
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name,
          username,
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          avatar_url: avatarUrl,
          phone
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update mission progress
      updateProfileMission();
      
      toast({
        title: "Perfil atualizado com sucesso",
      });
      
      // Check for profile completion achievement
      // Get updated user
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (updatedUser) {
        const achievement = AchievementsManager.checkProfileCompleted(updatedUser);
        if (achievement) {
          // Mark as shown to prevent duplicate showing
          const shownAchievements = AchievementsManager.getUnlockedAchievements(user.id);
          if (!shownAchievements.includes(achievement.id)) {
            shownAchievements.push(achievement.id);
            AchievementsManager.saveUnlockedAchievements(user.id, shownAchievements);
            onAchievementUnlocked?.(achievement);
          }
        }
      }
      
      setIsEditingProfile(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={updateProfile}>
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
