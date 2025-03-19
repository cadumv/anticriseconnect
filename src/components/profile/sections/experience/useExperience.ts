
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Experience } from "./types";

export const useExperience = (user: User) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>(
    user.user_metadata?.experiences || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        description: ""
      }
    ]);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    setExperiences(newExperiences);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          experiences: experiences 
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          experiences: experiences
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      toast({
        title: "Experiência profissional atualizada com sucesso",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar experiência profissional",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setExperiences(user.user_metadata?.experiences || []);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    experiences,
    isSaving,
    handleAddExperience,
    handleRemoveExperience,
    updateExperience,
    handleSave,
    handleCancel
  };
};
