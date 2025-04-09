
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Image } from "lucide-react";
import { containsEmailOrPhone } from "./utils";
import { toast } from "sonner";
import { uploadImages } from "@/services/posts/imageUploadService";

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() && !imageFile) return;
    
    // Check for email or phone number in the message
    if (message.trim() && containsEmailOrPhone(message)) {
      toast.error("Não é permitido enviar emails ou números de telefone nas mensagens. Esta funcionalidade está disponível apenas no plano premium.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = "";
      if (imageFile) {
        const uploadedImages = await uploadImages([imageFile]);
        if (uploadedImages.length > 0) {
          imageUrl = uploadedImages[0];
        }
      }
      
      onSendMessage(message, imageUrl);
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("O arquivo selecionado não é uma imagem");
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t">
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="h-20 w-auto rounded-md border border-gray-200"
          />
          <button 
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          className="min-h-[60px] resize-none"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <input 
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <Button 
          type="button" 
          size="icon" 
          variant="outline"
          onClick={handleImageSelect}
          className="flex-shrink-0"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          size="icon" 
          onClick={handleSendMessage}
          disabled={isSubmitting || (!message.trim() && !imageFile)}
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">
        O envio de emails e números de telefone não é permitido.
        <br/>
        Disponível no plano premium.
      </p>
    </div>
  );
}
