
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  userId: string | undefined;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

export const ProfileAvatar = ({ userId, avatarUrl, setAvatarUrl }: ProfileAvatarProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Você precisa selecionar uma imagem para fazer upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Verificar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 2MB.");
      }

      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        throw new Error("O arquivo deve ser uma imagem.");
      }

      // Fazer upload da imagem
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (error) throw error;

      // Gerar URL pública para a imagem
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Atualizar avatarUrl
      setAvatarUrl(urlData.publicUrl);

      toast({
        title: "Avatar atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload do avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-blue-500">
            {"U"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={uploadAvatar}
          className="hidden"
          accept="image/*"
        />
        <Button 
          type="button" 
          onClick={handleClickUpload} 
          variant="outline"
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {uploading ? "Enviando..." : "Alterar foto"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Recomendamos 320x320 pixels, com proporção 1:1.
        </p>
      </div>
    </div>
  );
};
