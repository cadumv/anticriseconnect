
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onPostCreated: (postId: string) => void;
}

export const CreatePostDialog = ({
  isOpen,
  onOpenChange,
  userId,
  onPostCreated
}: CreatePostDialogProps) => {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "O conteúdo da publicação não pode estar vazio",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: postContent,
            user_id: userId,
            metadata: {
              type: 'post',
            }
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Publicação criada com sucesso",
      });
      
      onOpenChange(false);
      setPostContent("");
      
      if (data && data[0]) {
        onPostCreated(data[0].id);
      }
      
    } catch (error: any) {
      console.error("Error creating post:", error);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
        >
          Criar publicação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova publicação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="O que você gostaria de compartilhar?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreatePost}
            disabled={isSubmitting || !postContent.trim()}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
