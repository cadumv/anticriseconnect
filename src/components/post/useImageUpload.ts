
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
      // Convert FileList to array for easier processing
      const fileArray = Array.from(files);
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      
      // Filter valid image files first
      const validFiles = fileArray.filter(file => 
        validImageTypes.includes(file.type.toLowerCase())
      );
      
      if (validFiles.length === 0) {
        toast.error("Por favor, selecione apenas arquivos de imagem válidos.");
        return null;
      }
      
      // Process each valid image file
      for (const file of validFiles) {
        // Limit to maxImages
        if (newImageFiles.length >= maxImages) break;
        
        try {
          // Resize image to standard size
          const resizedFile = await resizeImageToStandard(file);
          newImageFiles.push(resizedFile);
          
          // Generate preview of the resized image
          const reader = new FileReader();
          const preview = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              if (reader.result) {
                resolve(reader.result as string);
              } else {
                reject(new Error("Não foi possível gerar a pré-visualização"));
              }
            };
            reader.onerror = () => reject(new Error("Erro ao ler imagem para pré-visualização"));
            reader.readAsDataURL(resizedFile);
          });
          
          newImagePreviews.push(preview);
        } catch (error) {
          console.error("Erro ao processar imagem:", error);
          toast.error(`Erro ao processar ${file.name}. Tentando próxima imagem...`);
          // Continue with next image, don't exit the loop
        }
      }
      
      if (newImageFiles.length === 0) {
        toast.error("Não foi possível processar nenhuma das imagens selecionadas.");
        return null;
      }
      
      if (newImageFiles.length < validFiles.length) {
        toast.warning(`Apenas ${newImageFiles.length} de ${validFiles.length} imagens foram processadas com sucesso.`);
      }
      
      return { newFiles: newImageFiles, newPreviews: newImagePreviews };
    } catch (error) {
      console.error("Erro no processamento de imagens:", error);
      toast.error("Não foi possível processar as imagens. Por favor, tente novamente.");
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
