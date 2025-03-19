
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePostForm } from "@/hooks/usePostForm";
import { NewPostDialogContent } from "@/components/post/NewPostDialogContent";

interface NewPostDialogProps {
  onPostCreated: () => void;
}

export function NewPostDialog({ onPostCreated }: NewPostDialogProps) {
  const { user } = useAuth();
  const { 
    open, 
    handleOpenChange, 
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
    isSubmitting,
    isSubmitDisabled,
    handleCreatePost
  } = usePostForm(user, onPostCreated);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Publicar</span>
        </Button>
      </DialogTrigger>
      <NewPostDialogContent
        isSubmitting={isSubmitting}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        author={author}
        setAuthor={setAuthor}
        summary={summary}
        setSummary={setSummary}
        mainContent={mainContent}
        setMainContent={setMainContent}
        conclusions={conclusions}
        setConclusions={setConclusions}
        serviceArea={serviceArea}
        setServiceArea={setServiceArea}
        serviceDescription={serviceDescription}
        setServiceDescription={setServiceDescription}
        user={user}
        isSubmitDisabled={isSubmitDisabled}
        handleCreatePost={handleCreatePost}
      />
    </Dialog>
  );
}
