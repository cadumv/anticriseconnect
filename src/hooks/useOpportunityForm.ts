
import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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
      let finalImageUrl = null;
      
      // Upload image if there's an image file
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `opportunity-images/${fileName}`;
        
        // Upload to post_images bucket instead of posts/opportunity-images
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('post_images')
          .upload(filePath, imageFile);
        
        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrlData.publicUrl;
        console.log("Image uploaded successfully:", finalImageUrl);
      }
      
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
          image_url: finalImageUrl,
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
      
      if (error) {
        console.error("Post creation error:", error);
        throw error;
      }
      
      console.log("Opportunity created successfully:", data);
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
