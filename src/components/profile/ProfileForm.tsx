import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ProfileAvatar } from "./ProfileAvatar";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { ProfileFormActions } from "./ProfileFormActions";
import { useUsernameAvailability } from "@/hooks/useUsernameAvailability";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileForm = ({ user, setIsEditingProfile }: ProfileFormProps) => {
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
      
      toast({
        title: "Perfil atualizado com sucesso",
      });
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
