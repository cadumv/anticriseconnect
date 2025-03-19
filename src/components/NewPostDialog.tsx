import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePostForm } from "@/components/post/ServicePostForm";
import { TechnicalArticleForm } from "@/components/post/TechnicalArticleForm";
import { RegularPostForm } from "@/components/post/RegularPostForm";
import { PostDialogFooter } from "@/components/post/PostDialogFooter";
import { usePostCreation } from "@/hooks/usePostCreation";
import { ImageUploader } from "@/components/post/ImageUploader";

interface NewPostDialogProps {
  onPostCreated: () => void;
}

export function NewPostDialog({ onPostCreated }: NewPostDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
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
  
  const { isSubmitting, uploadImages, createPost } = usePostCreation(user, onPostCreated);
  
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

  const handleCreatePost = async () => {
    if (!user) return;
    
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
      
      const success = await createPost(postData);
      if (success) {
        setOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error('Error in handleCreatePost:', error);
    }
  };

  const isSubmitDisabled = 
    (selectedTab === "post" && !content.trim()) ||
    (selectedTab === "service" && (!serviceArea.trim() || !serviceDescription.trim())) ||
    (selectedTab === "technical_article" && (!title.trim() || !mainContent.trim()));

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
            <RegularPostForm
              content={content}
              setContent={setContent}
              imageFiles={imageFiles}
              imagePreviews={imagePreviews}
              setImageFiles={setImageFiles}
              setImagePreviews={setImagePreviews}
            />
          </TabsContent>
          
          <TabsContent value="service" className="space-y-4">
            <ServicePostForm
              title={serviceArea}
              setTitle={setServiceArea}
              content={serviceDescription}
              setContent={setServiceDescription}
            />
            
            <ImageUploader
              imageFiles={imageFiles}
              imagePreviews={imagePreviews}
              setImageFiles={setImageFiles}
              setImagePreviews={setImagePreviews}
              multiple={true}
              maxImages={5}
            />
          </TabsContent>
          
          <TabsContent value="technical_article" className="space-y-4">
            <TechnicalArticleForm
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              company={user?.user_metadata?.engineering_type || ""}
              setCompany={() => {}} // This is determined by user profile
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
            
            <ImageUploader
              imageFiles={imageFiles}
              imagePreviews={imagePreviews}
              setImageFiles={setImageFiles}
              setImagePreviews={setImagePreviews}
              multiple={true}
              maxImages={5}
            />
          </TabsContent>
        </Tabs>
        
        <PostDialogFooter
          isSubmitting={isSubmitting}
          isDisabled={isSubmitDisabled}
          onSubmit={handleCreatePost}
        />
      </DialogContent>
    </Dialog>
  );
}
