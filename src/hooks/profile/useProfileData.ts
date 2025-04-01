
import { useState, useEffect } from "react";
import { ProfileData, DEMO_PROFILE } from "@/types/profile";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UseProfileDataReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string;
}

export const useProfileData = (id: string | undefined, user: User | null): UseProfileDataReturn => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || id === ":id") {
      setLoading(false);
      setError("ID de perfil inválido");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Handle demo profile
        if (id === "demo") {
          console.log("Loading demo profile");
          setProfile(DEMO_PROFILE);
          setLoading(false);
          return;
        }
        
        console.log("Fetching profile with ID:", id);
        
        // First try to fetch the existing profile
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, username, engineering_type, professional_description, areas_of_expertise, avatar_url, phone')
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }
        
        // If profile doesn't exist, try to create a basic one
        if (!data) {
          console.log("Profile not found, creating a basic one");
          
          // Get user info from authentication if possible
          let name = "Usuário";
          let email = "";
          let username = null;
          
          try {
            // Use only the session claims or admin API depending on permissions
            if (user && user.id === id) {
              // If fetching own profile, use current user data
              name = user.user_metadata?.name || user.email?.split('@')[0] || "Usuário";
              email = user.email || "";
              username = email ? email.split('@')[0] : null;
            }
            
            // Create the basic profile
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: id,
                name: name,
                username: username,
                professional_description: "",
                areas_of_expertise: []
              })
              .select('id, name, username, engineering_type, professional_description, areas_of_expertise, avatar_url, phone')
              .single();
            
            if (insertError) {
              console.error("Error creating basic profile:", insertError);
              throw new Error("Não foi possível criar perfil básico");
            }
            
            // Get education and experience data from auth metadata if available
            const userData = user && user.id === id ? user.user_metadata : null;
            
            const profileData: ProfileData = {
              ...newProfile,
              education: userData?.education || [],
              experiences: userData?.experiences || []
            };
            
            setProfile(profileData);
          } catch (createError) {
            console.error("Error in profile creation process:", createError);
            throw new Error("Falha ao criar perfil básico");
          }
        } else {
          // For existing profile, check if we can get education and experience from metadata or database
          const userData = user && user.id === id ? user.user_metadata : null;
          
          // Use the education and experiences from the database if available, otherwise from metadata
          const profileData: ProfileData = {
            ...data,
            education: userData?.education || [],
            experiences: userData?.experiences || []
          };
          
          setProfile(profileData);
        }
      } catch (err: any) {
        console.error("Erro ao buscar perfil:", err);
        setError("Não foi possível carregar o perfil do profissional.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user]);

  return { profile, loading, error };
};
