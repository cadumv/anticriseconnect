
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { AchievementsManager } from "@/services/AchievementsManager";
import { Post } from "@/types/post";
import { ImageUploader } from "@/components/post/ImageUploader";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface NewPostDialogProps {
  onPostCreated: () => void;
}

export function NewPostDialog({ onPostCreated }: NewPostDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Changed from single image to multiple images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Additional fields for technical article
  const [author, setAuthor] = useState(""); // Add author state
  const [summary, setSummary] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [conclusions, setConclusions] = useState("");
  const [tags, setTags] = useState("");
  
  // Service fields
  const [serviceArea, setServiceArea] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      resetForm();
    }
    setOpen(newOpen);
  };
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageFiles([]);
    setImagePreviews([]);
    setSummary("");
    setMainContent("");
    setConclusions("");
    setTags("");
    setServiceArea("");
    setServiceDescription("");
    setSelectedTab("post");
    setAuthor("");
  };
  
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

  const createPost = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }
      
      // Basic post data
      const postData: any = {
        content: content,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // First image as the main image for backward compatibility
        user_id: user.id,
        metadata: {
          image_urls: imageUrls // Store all image URLs in metadata
        } // Initialize metadata as empty object
      };
      
      // Add additional data based on post type
      if (selectedTab === "technical_article") {
        // For technical articles, we'll store the additional fields in the metadata JSON field
        postData.metadata = {
          ...postData.metadata,
          type: "technical_article",
          title: title,
          summary: summary,
          mainContent: mainContent,
          conclusions: conclusions,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author: author.trim() || user.user_metadata?.name || "Anônimo",
          company: user.user_metadata?.engineering_type || "Engenheiro",
          image_urls: imageUrls
        };
      } else if (selectedTab === "service") {
        // For services, we'll store the additional fields in the metadata JSON field
        postData.metadata = {
          ...postData.metadata,
          title: serviceArea,
          type: "service",
          content: serviceDescription,
          author: user.user_metadata?.name || "Anônimo",
          company: user.user_metadata?.engineering_type || "Engenheiro",
          image_urls: imageUrls
        };
      } else {
        // Regular post
        postData.metadata = {
          ...postData.metadata,
          type: "post"
        };
      }
      
      console.log("Saving post data:", postData); // Debug log
      
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
      
      if (selectedTab === "technical_article") {
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
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Erro ao criar publicação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Publicar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova Publicação</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="post">Publicação</TabsTrigger>
            <TabsTrigger value="service">Serviço/Área</TabsTrigger>
            <TabsTrigger value="technical_article">Artigo Técnico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="post" className="space-y-4">
            <div className="space-y-4">
              <Textarea 
                placeholder="Compartilhe informações, dicas ou atualizações com outros engenheiros..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />
              
              <ImageUploader
                imageFiles={imageFiles}
                imagePreviews={imagePreviews}
                setImageFiles={setImageFiles}
                setImagePreviews={setImagePreviews}
                multiple={true}
                maxImages={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="service" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-area">Área de atuação/Serviço</Label>
                <Input 
                  id="service-area" 
                  placeholder="Ex: Projetos elétricos residenciais" 
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="service-description">Descrição detalhada</Label>
                <Textarea 
                  id="service-description"
                  placeholder="Descreva sua área de atuação, serviços oferecidos e diferenciais..." 
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <ImageUploader
                imageFiles={imageFiles}
                imagePreviews={imagePreviews}
                setImageFiles={setImageFiles}
                setImagePreviews={setImagePreviews}
                multiple={true}
                maxImages={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="technical_article" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="article-title">Título do artigo</Label>
                <Input 
                  id="article-title" 
                  placeholder="Ex: Impactos da NR10 na segurança elétrica" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="article-author">Autor</Label>
                <Input 
                  id="article-author" 
                  placeholder={user?.user_metadata?.name || "Seu nome"} 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="article-summary">Resumo</Label>
                <Textarea 
                  id="article-summary"
                  placeholder="Breve resumo do conteúdo do artigo" 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="article-content">Conteúdo principal</Label>
                <Textarea 
                  id="article-content"
                  placeholder="Conteúdo detalhado do artigo..." 
                  value={mainContent}
                  onChange={(e) => setMainContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <div>
                <Label htmlFor="article-conclusions">Conclusões</Label>
                <Textarea 
                  id="article-conclusions"
                  placeholder="Principais conclusões e considerações finais" 
                  value={conclusions}
                  onChange={(e) => setConclusions(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="article-tags">Tags (separadas por vírgula)</Label>
                <Input 
                  id="article-tags" 
                  placeholder="Ex: energia solar, sustentabilidade" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <ImageUploader
                imageFiles={imageFiles}
                imagePreviews={imagePreviews}
                setImageFiles={setImageFiles}
                setImagePreviews={setImagePreviews}
                multiple={true}
                maxImages={5}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            type="button" 
            onClick={createPost} 
            disabled={isSubmitting || 
              (selectedTab === "post" && !content.trim()) ||
              (selectedTab === "service" && (!serviceArea.trim() || !serviceDescription.trim())) ||
              (selectedTab === "technical_article" && (!title.trim() || !mainContent.trim()))}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
