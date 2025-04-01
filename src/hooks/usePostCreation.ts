
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { uploadImages } from "@/services/posts/imageUploadService";
import { checkPostAchievements } from "@/services/posts/achievementService";
import { preparePostMetadata } from "@/services/posts/metadataService";
import { createPostInDb, cachePostInLocalStorage } from "@/services/posts/postDbService";
import { PostType } from "@/types/postCreation";

export function usePostCreation(user: User | null, onPostCreated: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Creates a post in Supabase
   */
  const createPost = async (postData: any) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    
    try {
      // Extract post type
      const postType = postData.postType || 'post';
      
      // Upload images if any
      let imageUrls: string[] = [];
      if (postData.imageFiles && postData.imageFiles.length > 0) {
        imageUrls = await uploadImages(postData.imageFiles);
      }
      
      // Prepare metadata based on post type
      const metadata = preparePostMetadata(
        postType as PostType, 
        postData, 
        imageUrls,
        user?.user_metadata?.name,
        user?.user_metadata?.engineering_type
      );
      
      // Create post data
      const dbPostData = {
        content: postData.content,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // First image as main image for backward compatibility
        user_id: user.id,
        metadata: metadata
      };
      
      console.log("Saving post data:", dbPostData);
      
      // Save to Supabase
      const data = await createPostInDb(dbPostData);
      
      // Check for achievements
      checkPostAchievements(user.id, postType as PostType);
      
      // Cache post in localStorage for quicker access
      cachePostInLocalStorage(user.id, data);
      
      toast({
        title: "Publicação criada com sucesso",
        description: "Sua publicação já está disponível para visualização."
      });
      
      onPostCreated();
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Erro ao criar publicação",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createPost
  };
}
