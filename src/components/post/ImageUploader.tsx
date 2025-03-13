
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block">Imagem <span className="text-sm text-gray-500">(Opcional)</span></Label>
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <ImagePlus size={16} />
          Selecionar Imagem
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      
      {imagePreview && (
        <div className="mt-2 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 rounded-md object-contain border"
          />
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
