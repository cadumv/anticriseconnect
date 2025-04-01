
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { useImageUpload } from "./useImageUpload";

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
  const { isProcessing, processImages } = useImageUpload(maxImages);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await processImages(
      e.target.files, 
      imageFiles, 
      imagePreviews, 
      multiple
    );
    
    if (result) {
      setImageFiles(result.newFiles);
      setImagePreviews(result.newPreviews);
    }
    
    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      
      {isProcessing && (
        <div className="py-2 flex justify-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <span className="ml-2 text-sm text-gray-500">Processando imagens...</span>
        </div>
      )}
      
      <ImagePreview 
        previews={imagePreviews} 
        onRemove={removeImage} 
      />
    </div>
  );
}
