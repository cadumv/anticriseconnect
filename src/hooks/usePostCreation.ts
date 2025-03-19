
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AchievementsManager } from "@/services/AchievementsManager";

export function usePostCreation(user: User | null, onPostCreated: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const createPost = async (postData: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Saving post data:", postData);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Check for achievements
      const firstPublicationAchievement = AchievementsManager.checkFirstPublicationAchievement(user.id);
      if (firstPublicationAchievement) {
        // Mark as shown to prevent duplicate popups
        const shownAchievements = AchievementsManager.getUnlockedAchievements(user.id);
        if (!shownAchievements.includes(firstPublicationAchievement.id)) {
          shownAchievements.push(firstPublicationAchievement.id);
          AchievementsManager.saveUnlockedAchievements(user.id, shownAchievements);
        }
      }
      
      if (postData.metadata?.type === "technical_article") {
        const technicalArticleAchievement = AchievementsManager.checkTechnicalArticleAchievement(user.id);
        if (technicalArticleAchievement) {
          // Mark as shown to prevent duplicate popups
          const shownAchievements = AchievementsManager.getUnlockedAchievements(user.id);
          if (!shownAchievements.includes(technicalArticleAchievement.id)) {
            shownAchievements.push(technicalArticleAchievement.id);
            AchievementsManager.saveUnlockedAchievements(user.id, shownAchievements);
          }
        }
      }
      
      // Load user posts to localStorage for quicker access
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
