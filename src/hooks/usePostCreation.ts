
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AchievementsManager } from "@/services/AchievementsManager";

type PostType = 'post' | 'technical_article' | 'service' | 'opportunity';

interface PostMetadata {
  type: PostType;
  title?: string;
  author?: string;
  company?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  tags?: string[];
  image_urls?: string[];
  // Service-specific fields
  content?: string;
  // Opportunity-specific fields
  location?: string;
  partnerCount?: string;
  deadline?: string;
  skills?: string[];
  engineeringType?: string;
}

interface PostData {
  content: string;
  image_url?: string | null;
  user_id: string;
  metadata: PostMetadata;
}

export function usePostCreation(user: User | null, onPostCreated: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Uploads multiple images to Supabase storage
   */
  const uploadImages = async (files: File[]): Promise<string[]> => {
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

  /**
   * Prepares post metadata based on post type
   */
  const preparePostMetadata = (
    postType: PostType, 
    data: Record<string, any>, 
    imageUrls: string[]
  ): PostMetadata => {
    // Common metadata for all post types
    const metadata: PostMetadata = {
      type: postType,
      image_urls: imageUrls
    };

    // Add metadata specific to post type
    switch (postType) {
      case 'technical_article':
        return {
          ...metadata,
          title: data.title,
          summary: data.summary,
          mainContent: data.mainContent,
          conclusions: data.conclusions,
          tags: data.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) || [],
          author: data.author?.trim() || user?.user_metadata?.name || "Anônimo",
          company: data.company || user?.user_metadata?.engineering_type || "Engenheiro"
        };
      
      case 'service':
        return {
          ...metadata,
          title: data.serviceArea,
          content: data.serviceDescription,
          author: user?.user_metadata?.name || "Anônimo",
          company: user?.user_metadata?.engineering_type || "Engenheiro"
        };
      
      case 'opportunity':
        return {
          ...metadata,
          title: data.title,
          location: data.location,
          partnerCount: data.partnerCount,
          deadline: data.deadline,
          skills: data.skills?.split(',').map((skill: string) => skill.trim()).filter(Boolean) || [],
          engineeringType: data.engineeringType
        };
      
      default:
        return metadata;
    }
  };

  /**
   * Checks for achievements based on post type
   */
  const checkPostAchievements = (userId: string, postType: PostType) => {
    // Check for first publication achievement
    const firstPublicationAchievement = AchievementsManager.checkFirstPublicationAchievement(userId);
    if (firstPublicationAchievement) {
      const shownAchievements = AchievementsManager.getUnlockedAchievements(userId);
      if (!shownAchievements.includes(firstPublicationAchievement.id)) {
        shownAchievements.push(firstPublicationAchievement.id);
        AchievementsManager.saveUnlockedAchievements(userId, shownAchievements);
      }
    }
    
    // Check for post-type specific achievements
    if (postType === 'technical_article') {
      const technicalArticleAchievement = AchievementsManager.checkTechnicalArticleAchievement(userId);
      if (technicalArticleAchievement) {
        const shownAchievements = AchievementsManager.getUnlockedAchievements(userId);
        if (!shownAchievements.includes(technicalArticleAchievement.id)) {
          shownAchievements.push(technicalArticleAchievement.id);
          AchievementsManager.saveUnlockedAchievements(userId, shownAchievements);
        }
      }
    }
  };

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
      const metadata = preparePostMetadata(postType, postData, imageUrls);
      
      // Create post data
      const dbPostData: PostData = {
        content: postData.content,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // First image as main image for backward compatibility
        user_id: user.id,
        metadata: metadata
      };
      
      console.log("Saving post data:", dbPostData);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert(dbPostData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Check for achievements
      checkPostAchievements(user.id, postType as PostType);
      
      // Cache post in localStorage for quicker access
      const postsKey = `user_posts_${user.id}`;
      const savedPosts = localStorage.getItem(postsKey);
      const posts = savedPosts ? JSON.parse(savedPosts) : [];
      posts.unshift(data);
      localStorage.setItem(postsKey, JSON.stringify(posts));
      
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
    uploadImages,
    createPost
  };
}
