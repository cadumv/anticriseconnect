
import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseOpportunityFormProps {
  onOpportunityCreated: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useOpportunityForm({ onOpportunityCreated, onOpenChange }: UseOpportunityFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [partnerCount, setPartnerCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [engineeringType, setEngineeringType] = useState("");
  
  // For the image uploader
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl(null);
    setImageFile(null);
    setImagePreview(null);
    setLocation("");
    setPartnerCount("");
    setDeadline("");
    setSkills("");
    setEngineeringType("");
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para publicar uma oportunidade");
      return;
    }
    
    if (!title || !description) {
      toast.error("Título e descrição são obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create skills array from comma-separated string
      const skillsArray = skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill !== "");
      
      // Create the post in Supabase
      const { data, error } = await supabase
        .from("posts")
        .insert({
          content: description,
          image_url: imageUrl,
          user_id: user.id,
          metadata: {
            type: "opportunity",
            title: title,
            location: location,
            partnerCount: partnerCount,
            deadline: deadline,
            skills: skillsArray,
            engineeringType: engineeringType
          }
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Oportunidade publicada com sucesso!");
      onOpportunityCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("Erro ao publicar oportunidade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    location,
    setLocation,
    partnerCount,
    setPartnerCount,
    deadline,
    setDeadline,
    skills,
    setSkills,
    engineeringType,
    setEngineeringType,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    imageUrl,
    setImageUrl,
    isSubmitting,
    handleSubmit
  };
}
