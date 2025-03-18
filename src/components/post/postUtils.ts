
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { checkFirstPublicationAchievement } from "@/services/achievements/publication-achievements";
import { updatePublicationMissionProgress, updateKnowledgeMissionProgress } from "@/components/achievements/utils/missions";
import { supabase } from "@/lib/supabase";

export interface PostData {
  id: string;
  title: string;
  content: string;
  type: 'service' | 'technical_article';
  timestamp: string;
  imageUrl?: string;
  author?: string;
  company?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  likes?: number;
  saves?: number;
  shares?: number;
}

export const savePost = async (
  user: User, 
  postData: PostData
) => {
  try {
    // Ensure all article fields are included in the metadata
    const metadata: Record<string, any> = {
      type: postData.type,
      title: postData.title,
      author: postData.author,
      company: postData.company,
    };
    
    // Add fields specific to technical articles
    if (postData.type === 'technical_article') {
      metadata.summary = postData.summary;
      metadata.mainContent = postData.mainContent;
      metadata.conclusions = postData.conclusions;
    }
    
    // Save post to Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: postData.content,
        image_url: postData.imageUrl,
        metadata: metadata // Store additional fields in metadata column
      })
      .select();
    
    if (error) throw error;
    
    // For backward compatibility with local storage
    const publicationsKey = `user_publications_${user.id}`;
    const existingPublications = localStorage.getItem(publicationsKey);
    const publications = existingPublications ? JSON.parse(existingPublications) : [];
    publications.unshift(postData);
    localStorage.setItem(publicationsKey, JSON.stringify(publications));
    
    checkFirstPublicationAchievement(user.id);
    
    if (postData.type === 'service') {
      const missionResult = updatePublicationMissionProgress(user.id);
      if (missionResult.missionCompleted) {
        toast({
          title: "Missão Completa!",
          description: "Você completou a missão 'Apresente seus serviços ou área de atuação' e ganhou 75 pontos!",
          variant: "default",
        });
      }
    } else if (postData.type === 'technical_article') {
      const missionResult = updateKnowledgeMissionProgress(user.id);
      if (missionResult.missionCompleted) {
        toast({
          title: "Missão Completa!",
          description: "Você completou a missão 'Compartilhe seu conhecimento' e ganhou 125 pontos!",
          variant: "default",
        });
      }
    }

    toast({
      title: "Publicação criada",
      description: "Sua publicação foi criada com sucesso e já aparece no seu feed!",
    });
    
    return data[0];
  } catch (error) {
    console.error("Error saving post:", error);
    toast({
      title: "Erro ao criar publicação",
      description: "Não foi possível criar sua publicação. Tente novamente.",
      variant: "destructive",
    });
    throw error;
  }
};

export const validatePostData = (
  postType: 'service' | 'technical_article',
  title: string,
  content: string,
  summary?: string
): boolean => {
  if (!title.trim() || !content.trim()) {
    toast({
      title: "Campos obrigatórios",
      description: "Por favor, preencha o título e o conteúdo da publicação",
      variant: "destructive",
    });
    return false;
  }
  
  if (postType === 'technical_article' && summary && !summary.trim()) {
    toast({
      title: "Resumo obrigatório",
      description: "Para artigos técnicos, o resumo é obrigatório",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export const createPostData = (
  postType: 'service' | 'technical_article',
  title: string,
  content: string,
  imageUrl: string | null,
  author: string = '',
  company: string = '',
  summary: string = '',
  mainContent: string = '',
  conclusions: string = '',
  userName: string = ''
): PostData => {
  const newPost: PostData = {
    id: uuidv4(),
    title: title.trim(),
    content: content.trim(),
    type: postType,
    timestamp: new Date().toISOString(),
    imageUrl: imageUrl || undefined, // Garante que imageUrl seja undefined se for null
    likes: 0,
    saves: 0,
    shares: 0
  };
  
  if (postType === 'technical_article') {
    newPost.author = author.trim() || userName || "Usuário";
    newPost.company = company.trim() || undefined;
    newPost.summary = summary.trim();
    newPost.mainContent = mainContent.trim() || content.trim();
    newPost.conclusions = conclusions.trim() || undefined;
  }
  
  console.log("Created technical article post:", newPost); // Debug
  
  return newPost;
};
