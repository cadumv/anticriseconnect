import { useState } from "react";
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

interface PostData {
  id: string;
  title: string;
  content: string;
  type: 'service' | 'technical_article';
  timestamp: string;
}

export function NewPostDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<'service' | 'technical_article'>('service');

  const handleSubmit = () => {
    if (!user) return;
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo da publicação",
        variant: "destructive",
      });
      return;
    }
    
    const newPost: PostData = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      type: postType,
      timestamp: new Date().toISOString()
    };
    
    // Save publication to user's data
    const publicationsKey = `user_publications_${user.id}`;
    const existingPublications = localStorage.getItem(publicationsKey);
    const publications = existingPublications ? JSON.parse(existingPublications) : [];
    publications.unshift(newPost);
    localStorage.setItem(publicationsKey, JSON.stringify(publications));
    
    // Save to user's feed
    const postsKey = `user_posts_${user.id}`;
    const existingPosts = localStorage.getItem(postsKey);
    const posts = existingPosts ? JSON.parse(existingPosts) : [];
    posts.unshift({
      ...newPost,
      author: user.user_metadata?.name || "Usuário",
      date: "Agora"
    });
    localStorage.setItem(postsKey, JSON.stringify(posts));
    
    // Check for first publication achievement
    checkFirstPublicationAchievement(user.id);
    
    // Update mission progress based on publication type
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

    // Reset form and close dialog
    setTitle("");
    setContent("");
    setPostType('service');
    setOpen(false);
    
    toast({
      title: "Publicação criada",
      description: "Sua publicação foi criada com sucesso!",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Novo Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
          
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe seu conhecimento ou serviço com outros engenheiros"
              rows={6}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Publicar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
