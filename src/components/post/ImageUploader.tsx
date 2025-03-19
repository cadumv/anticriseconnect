
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { resizeImageToStandard } from "./imageUtils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageUploaderProps {
  imageFiles: File[];
  imagePreviews: string[];
  setImageFiles: (files: File[]) => void;
  setImagePreviews: (previews: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
}

export function ImageUploader({ 
  imageFiles, 
  imagePreviews, 
  setImageFiles, 
  setImagePreviews,
  multiple = false,
  maxImages = 5
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    // If not multiple, replace current images
    const newImageFiles = multiple ? [...imageFiles] : [];
    const newImagePreviews = multiple ? [...imagePreviews] : [];
    
    // Check if we would exceed the maximum number of images
    if (multiple && newImageFiles.length + files.length > maxImages) {
      toast.error(`No máximo ${maxImages} imagens são permitidas`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Limit to maxImages
        if (newImageFiles.length >= maxImages) break;
        
        // Redimensiona a imagem para o tamanho padrão
        const resizedFile = await resizeImageToStandard(file);
        newImageFiles.push(resizedFile);
        
        // Gera preview da imagem redimensionada
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(resizedFile);
        });
        
        newImagePreviews.push(preview);
      }
      
      setImageFiles(newImageFiles);
      setImagePreviews(newImagePreviews);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Não foi possível processar a imagem. Tente outra imagem.");
    } finally {
      setIsProcessing(false);
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1"
          disabled={isProcessing || (multiple && imageFiles.length >= maxImages)}
        >
          <ImagePlus size={16} />
          {isProcessing ? "Processando..." : "Selecionar Imagem"}
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isProcessing}
          multiple={multiple}
        />
        {multiple && (
          <span className="text-sm text-gray-500">
            {imageFiles.length}/{maxImages} imagens
          </span>
        )}
      </div>
      
      {imagePreviews.length > 0 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <AspectRatio ratio={1}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="rounded-md object-cover w-full h-full border"
                />
              </AspectRatio>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
