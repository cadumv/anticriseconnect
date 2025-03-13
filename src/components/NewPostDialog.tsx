import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { checkFirstPublicationAchievement } from "@/services/achievements/publication-achievements";
import { updatePublicationMissionProgress, updateKnowledgeMissionProgress } from "@/components/achievements/utils/missions";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThumbsUp, Bookmark, Share2, ImagePlus, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PostData {
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

export function NewPostDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<'service' | 'technical_article'>('service');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [author, setAuthor] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [conclusions, setConclusions] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !user) return null;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer o upload da imagem.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setPostType('service');
    setImageFile(null);
    setImagePreview(null);
    setAuthor("");
    setCompany("");
    setSummary("");
    setMainContent("");
    setConclusions("");
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo da publicação",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (postType === 'technical_article' && !summary.trim()) {
      toast({
        title: "Resumo obrigatório",
        description: "Para artigos técnicos, o resumo é obrigatório",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }
    
    const newPost: PostData = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      type: postType,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl || undefined,
      likes: 0,
      saves: 0,
      shares: 0
    };
    
    if (postType === 'technical_article') {
      newPost.author = author.trim() || user.user_metadata?.name || "Usuário";
      newPost.company = company.trim() || undefined;
      newPost.summary = summary.trim();
      newPost.mainContent = mainContent.trim() || content.trim();
      newPost.conclusions = conclusions.trim() || undefined;
    }
    
    const publicationsKey = `user_publications_${user.id}`;
    const existingPublications = localStorage.getItem(publicationsKey);
    const publications = existingPublications ? JSON.parse(existingPublications) : [];
    publications.unshift(newPost);
    localStorage.setItem(publicationsKey, JSON.stringify(publications));
    
    const postsKey = `user_posts_${user.id}`;
    const existingPosts = localStorage.getItem(postsKey);
    const posts = existingPosts ? JSON.parse(existingPosts) : [];
    
    const feedPost = {
      ...newPost,
      author: newPost.author || user.user_metadata?.name || "Usuário",
      date: "Agora"
    };
    
    posts.unshift(feedPost);
    localStorage.setItem(postsKey, JSON.stringify(posts));
    
    checkFirstPublicationAchievement(user.id);
    
    if (postType === 'service') {
      const missionResult = updatePublicationMissionProgress(user.id);
      if (missionResult.missionCompleted) {
        toast({
          title: "Missão Completa!",
          description: "Você completou a missão 'Apresente seus serviços ou área de atuação' e ganhou 75 pontos!",
          variant: "default",
        });
      }
    } else if (postType === 'technical_article') {
      const missionResult = updateKnowledgeMissionProgress(user.id);
      if (missionResult.missionCompleted) {
        toast({
          title: "Missão Completa!",
          description: "Você completou a missão 'Compartilhe seu conhecimento' e ganhou 125 pontos!",
          variant: "default",
        });
      }
    }

    resetForm();
    setOpen(false);
    setIsLoading(false);
    
    toast({
      title: "Publicação criada",
      description: "Sua publicação foi criada com sucesso e já aparece no seu feed!",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Novo Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Publicação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <RadioGroup
              value={postType}
              onValueChange={(value) => setPostType(value as 'service' | 'technical_article')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service">Gostaria de publicar um serviço ou área de atuação?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical_article" id="technical_article" />
                <Label htmlFor="technical_article">Gostaria de publicar um artigo técnico?</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da sua publicação"
            />
          </div>
          
          {postType === 'service' && (
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descreva seus serviços ou área de atuação"
                rows={6}
              />
            </div>
          )}
          
          {postType === 'technical_article' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={user?.user_metadata?.name || "Seu nome"}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Empresa ou Experiência <span className="text-sm text-gray-500">(Opcional)</span></Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Onde você aplicou este conhecimento?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Resumo do Artigo</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve introdução explicando o que será abordado"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mainContent">Conteúdo Principal</Label>
                <Textarea
                  id="mainContent"
                  value={mainContent}
                  onChange={(e) => setMainContent(e.target.value)}
                  placeholder="Explicação técnica detalhada, problemas enfrentados, soluções aplicadas..."
                  rows={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conclusions">Principais Conclusões <span className="text-sm text-gray-500">(Opcional)</span></Label>
                <Textarea
                  id="conclusions"
                  value={conclusions}
                  onChange={(e) => setConclusions(e.target.value)}
                  placeholder="Destaque os aprendizados e recomendações finais"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo Simplificado (exibido no feed)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Versão resumida do seu artigo para exibição no feed"
                  rows={4}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label className="block">Imagem <span className="text-sm text-gray-500">(Opcional)</span></Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImagePlus size={16} />
                Selecionar Imagem
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-md object-contain border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
