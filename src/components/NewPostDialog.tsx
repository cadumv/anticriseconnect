
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Additional fields for technical article
  const [author, setAuthor] = useState(""); // Add author state
  const [summary, setSummary] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [conclusions, setConclusions] = useState("");
  const [tags, setTags] = useState("");
  
  // Service fields
  const [serviceArea, setServiceArea] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
    setImageFile(null);
    setImagePreview(null);
    setSummary("");
    setMainContent("");
    setConclusions("");
    setTags("");
    setServiceArea("");
    setServiceDescription("");
    setSelectedTab("post");
    setAuthor("");
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const createPost = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Basic post data
      const postData: any = {
        content: content,
        image_url: imageUrl,
        user_id: user.id,
        metadata: {} // Initialize metadata as empty object
      };
      
      // Add additional data based on post type
      if (selectedTab === "technical_article") {
        // For technical articles, we'll store the additional fields in the metadata JSON field
        postData.metadata = {
          title: title,
          type: "technical_article",
          summary: summary,
          mainContent: mainContent,
          conclusions: conclusions,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author: author.trim() || user.user_metadata?.name || "Anônimo",
          company: user.user_metadata?.engineering_type || "Engenheiro"
        };
      } else if (selectedTab === "service") {
        // For services, we'll store the additional fields in the metadata JSON field
        postData.metadata = {
          title: serviceArea,
          type: "service",
          content: serviceDescription,
          author: user.user_metadata?.name || "Anônimo",
          company: user.user_metadata?.engineering_type || "Engenheiro"
        };
      } else {
        // Regular post
        postData.metadata = {
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
              
              {imagePreview && (
                <div className="relative mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 rounded-md object-contain mx-auto"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar imagem
                </Button>
              </div>
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
              
              {imagePreview && (
                <div className="relative mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 rounded-md object-contain mx-auto"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar imagem
                </Button>
              </div>
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
              
              {imagePreview && (
                <div className="relative mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 rounded-md object-contain mx-auto"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar imagem
                </Button>
              </div>
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
