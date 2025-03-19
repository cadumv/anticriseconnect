
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from "@/types/profile";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Mission } from "@/components/achievements/types/mission";

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

interface UseProfileFormSubmitProps {
  user: User;
  name: string;
  username: string;
  phone: string;
  engineeringType: string;
  professionalDescription: string;
  areasOfExpertise: string[];
  education: Education[];
  experiences: Experience[];
  interests: string[];
  avatarUrl: string;
  setIsEditingProfile: (isEditing: boolean) => void;
  usernameAvailable: boolean;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const useProfileFormSubmit = ({
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
}: UseProfileFormSubmitProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameAvailable) {
      toast({
        title: "Nome de usuário indisponível",
        description: "Escolha outro nome de usuário",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Filtrar áreas de expertise vazias
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      // Filtrar interesses vazios
      const filteredInterests = interests.filter(interest => interest.trim() !== "");
      
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          username,
          phone, 
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          education,
          experiences,
          interests: filteredInterests,
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
          education,
          experiences,
          interests: filteredInterests,
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

  return {
    loading,
    handleSubmit
  };
};
