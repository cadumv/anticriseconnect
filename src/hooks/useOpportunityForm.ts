
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
  const [location, setLocation] = useState("");
  const [partnerCount, setPartnerCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [engineeringType, setEngineeringType] = useState("");
  
  // For the image uploader - multiple images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFiles([]);
    setImagePreviews([]);
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
      const imageUrls: string[] = [];
      
      // Upload all images if there are image files
      if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `opportunity-images/${fileName}`;
          
          // Upload to post_images bucket
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
          
          imageUrls.push(publicUrlData.publicUrl);
          console.log("Image uploaded successfully:", publicUrlData.publicUrl);
        }
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
          image_url: imageUrls.length > 0 ? imageUrls[0] : null, // First image as the main image for backward compatibility
          user_id: user.id,
          metadata: {
            type: "opportunity",
            title: title,
            location: location,
            partnerCount: partnerCount,
            deadline: deadline,
            skills: skillsArray,
            engineeringType: engineeringType,
            image_urls: imageUrls // All images stored in metadata
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
    imageFiles,
    setImageFiles,
    imagePreviews,
    setImagePreviews,
    isSubmitting,
    handleSubmit
  };
}
