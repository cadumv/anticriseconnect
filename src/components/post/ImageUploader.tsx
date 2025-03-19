
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { resizeImageToStandard } from "./imageUtils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageUploaderProps {
  imageFile: File | null;
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
}

export function ImageUploader({ 
  imageFile, 
  imagePreview, 
  setImageFile, 
  setImagePreview 
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      
      try {
        // Redimensiona a imagem para o tamanho padrão
        const resizedFile = await resizeImageToStandard(file);
        setImageFile(resizedFile);
        
        // Gera preview da imagem redimensionada
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setIsProcessing(false);
        };
        reader.readAsDataURL(resizedFile);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        toast({
          title: "Erro no processamento",
          description: "Não foi possível processar a imagem. Tente outra imagem.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1"
          disabled={isProcessing}
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
        />
      </div>
      
      {imagePreview && (
        <div className="mt-2 relative w-full max-w-sm">
          <AspectRatio ratio={1}>
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-md object-cover w-full h-full border"
            />
          </AspectRatio>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
}
