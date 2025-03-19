
import { useState } from "react";
import { toast } from "sonner";
import { resizeImageToStandard } from "./imageUtils";

export function useImageUpload(maxImages: number = 5) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImages = async (
    files: FileList | null,
    currentFiles: File[],
    currentPreviews: string[],
    multiple: boolean
  ): Promise<{ newFiles: File[], newPreviews: string[] } | null> => {
    if (!files || files.length === 0) return null;
    
    // If not multiple, replace current images
    const newImageFiles = multiple ? [...currentFiles] : [];
    const newImagePreviews = multiple ? [...currentPreviews] : [];
    
    // Check if we would exceed the maximum number of images
    if (multiple && newImageFiles.length + files.length > maxImages) {
      toast.error(`No máximo ${maxImages} imagens são permitidas`);
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Limit to maxImages
        if (newImageFiles.length >= maxImages) break;
        
        // Resize image to standard size
        const resizedFile = await resizeImageToStandard(file);
        newImageFiles.push(resizedFile);
        
        // Generate preview of the resized image
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(resizedFile);
        });
        
        newImagePreviews.push(preview);
      }
      
      return { newFiles: newImageFiles, newPreviews: newImagePreviews };
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Não foi possível processar a imagem. Tente outra imagem.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processImages
  };
}
