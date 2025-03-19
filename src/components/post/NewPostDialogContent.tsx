
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePostForm } from "@/components/post/ServicePostForm";
import { TechnicalArticleForm } from "@/components/post/TechnicalArticleForm";
import { RegularPostForm } from "@/components/post/RegularPostForm";
import { PostDialogFooter } from "@/components/post/PostDialogFooter";
import { ImageUploader } from "@/components/post/ImageUploader";
import { User } from "@supabase/supabase-js";

interface NewPostDialogContentProps {
  isSubmitting: boolean;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  imagePreviews: string[];
  setImagePreviews: (previews: string[]) => void;
  author: string;
  setAuthor: (author: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  mainContent: string;
  setMainContent: (mainContent: string) => void;
  conclusions: string;
  setConclusions: (conclusions: string) => void;
  serviceArea: string;
  setServiceArea: (serviceArea: string) => void;
  serviceDescription: string;
  setServiceDescription: (serviceDescription: string) => void;
  user: User | null;
  isSubmitDisabled: boolean;
  handleCreatePost: () => Promise<void>;
}

export function NewPostDialogContent({
  isSubmitting,
  selectedTab,
  setSelectedTab,
  title,
  setTitle,
  content,
  setContent,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  author,
  setAuthor,
  summary,
  setSummary,
  mainContent,
  setMainContent,
  conclusions,
  setConclusions,
  serviceArea,
  setServiceArea,
  serviceDescription,
  setServiceDescription,
  user,
  isSubmitDisabled,
  handleCreatePost
}: NewPostDialogContentProps) {
  return (
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
  );
}
