
import { supabase } from "@/lib/supabase";

/**
 * Uploads multiple images to Supabase storage
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  try {
    const imageUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
      
      imageUrls.push(data.publicUrl);
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
