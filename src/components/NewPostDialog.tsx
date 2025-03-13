
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { ImageUploader } from "./post/ImageUploader";
import { PostTypeSelector } from "./post/PostTypeSelector";
import { ServicePostForm } from "./post/ServicePostForm";
import { TechnicalArticleForm } from "./post/TechnicalArticleForm";
import { createPostData, savePost, validatePostData } from "./post/postUtils";
import { supabase } from "@/integrations/supabase/client";

interface NewPostDialogProps {
  onPostCreated?: () => void;
}

export function NewPostDialog({ onPostCreated }: NewPostDialogProps) {
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
    
    if (!validatePostData(postType, title, content, summary)) {
      setIsLoading(false);
      return;
    }
    
    let imageUrl = null;
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
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
          
        imageUrl = data.publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer o upload da imagem.",
          variant: "destructive",
        });
      }
    }
    
    const newPost = createPostData(
      postType,
      title,
      content,
      imageUrl,
      author,
      company,
      summary,
      mainContent,
      conclusions,
      user.user_metadata?.name
    );
    
    try {
      await savePost(user, newPost);
      resetForm();
      setOpen(false);
      
      // Call the callback function if provided
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
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
          <PostTypeSelector postType={postType} setPostType={setPostType} />
          
          {postType === 'service' ? (
            <ServicePostForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />
          ) : (
            <TechnicalArticleForm
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              company={company}
              setCompany={setCompany}
              summary={summary}
              setSummary={setSummary}
              mainContent={mainContent}
              setMainContent={setMainContent}
              conclusions={conclusions}
              setConclusions={setConclusions}
              content={content}
              setContent={setContent}
              userName={user?.user_metadata?.name}
            />
          )}
          
          <ImageUploader
            imageFile={imageFile}
            imagePreview={imagePreview}
            setImageFile={setImageFile}
            setImagePreview={setImagePreview}
          />
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
