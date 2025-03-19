
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { usePostCreation } from "@/hooks/usePostCreation";

export function usePostForm(user: User | null, onPostCreated: () => void) {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Image state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Technical article fields
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [mainContent, setMainContent] = useState("");
  const [conclusions, setConclusions] = useState("");
  const [tags, setTags] = useState("");
  
  // Service fields
  const [serviceArea, setServiceArea] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  
  const { isSubmitting, createPost } = usePostCreation(user, onPostCreated);
  
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
      let postData: Record<string, any> = {};
      
      // Add data based on post type
      if (selectedTab === "technical_article") {
        postData = {
          postType: "technical_article",
          content,
          title,
          summary,
          mainContent,
          conclusions,
          tags,
          author: author.trim() || user.user_metadata?.name || "Anônimo",
          company: user.user_metadata?.engineering_type || "Engenheiro",
          imageFiles
        };
      } else if (selectedTab === "service") {
        postData = {
          postType: "service",
          content: serviceDescription,
          serviceArea,
          serviceDescription,
          imageFiles
        };
      } else {
        // Regular post
        postData = {
          postType: "post",
          content,
          imageFiles
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

  return {
    open,
    setOpen,
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
  };
}
