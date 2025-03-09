
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface UseProfileDescriptionProps {
  engineeringType: string;
  areasOfExpertise: string[];
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
}

export const useProfileDescription = ({
  engineeringType,
  areasOfExpertise,
  professionalDescription,
  setProfessionalDescription
}: UseProfileDescriptionProps) => {
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);

  const generateProfessionalDescription = async () => {
    setIsGeneratingDescription(true);
    console.log("Starting professional description generation");
    
    try {
      // Filter out empty areas of expertise
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      console.log("Calling Supabase function with:", { 
        engineeringType, 
        keywords: filteredAreas 
      });
      
      const { data, error } = await supabase.functions.invoke('generate-professional-description', {
        body: {
          engineeringType,
          keywords: filteredAreas,
          action: 'generate'
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (data.error) {
        console.error("Data contains error:", data.error);
        throw new Error(data.error);
      }

      console.log("Setting description:", data.description);
      setProfessionalDescription(data.description);
      toast({
        title: "Descrição gerada com sucesso",
        description: "Uma descrição profissional foi criada com base no seu perfil."
      });
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast({
        title: "Erro ao gerar descrição",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const improveProfessionalDescription = async () => {
    if (!professionalDescription.trim()) {
      toast({
        title: "Descrição vazia",
        description: "É necessário ter uma descrição para melhorá-la.",
        variant: "destructive",
      });
      return;
    }

    setIsImprovingDescription(true);
    console.log("Starting professional description improvement");
    
    try {
      // Filter out empty areas of expertise
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      console.log("Calling Supabase function with:", { 
        engineeringType, 
        keywords: filteredAreas,
        currentDescription: professionalDescription,
        action: 'improve' 
      });
      
      const { data, error } = await supabase.functions.invoke('generate-professional-description', {
        body: {
          engineeringType,
          keywords: filteredAreas,
          currentDescription: professionalDescription,
          action: 'improve'
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (data.error) {
        console.error("Data contains error:", data.error);
        throw new Error(data.error);
      }

      console.log("Setting improved description:", data.description);
      setProfessionalDescription(data.description);
      toast({
        title: "Descrição melhorada com sucesso",
        description: "A IA aprimorou sua descrição profissional."
      });
    } catch (error: any) {
      console.error('Error improving description:', error);
      toast({
        title: "Erro ao melhorar descrição",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsImprovingDescription(false);
    }
  };

  return {
    isGeneratingDescription,
    isImprovingDescription,
    generateProfessionalDescription,
    improveProfessionalDescription
  };
};
