
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Education } from "./types";

export const useEducation = (user: User) => {
  const [isEditing, setIsEditing] = useState(false);
  const [education, setEducation] = useState<Education[]>(
    user.user_metadata?.education || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        description: ""
      }
    ]);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducation(newEducation);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          education: education 
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          education: education
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      toast({
        title: "Formação acadêmica atualizada com sucesso",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar formação acadêmica",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEducation(user.user_metadata?.education || []);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    education,
    isSaving,
    handleAddEducation,
    handleRemoveEducation,
    updateEducation,
    handleSave,
    handleCancel
  };
};
