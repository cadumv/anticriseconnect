
import React from "react";
import { Share2, Send } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  postId: string;
  onShare: (postId: string) => void;
}

export function ShareButton({ postId, onShare }: ShareButtonProps) {
  const handleGenerateLink = () => {
    // Generate a shareable link
    const url = `${window.location.origin}/post/${postId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("Link copiado para a área de transferência");
      })
      .catch(() => {
        toast.error("Não foi possível copiar o link");
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <ActionButton
            onClick={() => {}}
            icon={Share2}
            label="Compartilhar"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Compartilhar publicação</h4>
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onShare(postId)}
              className="justify-start"
            >
              Compartilhar com contatos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateLink}
              className="justify-start"
            >
              Copiar link
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
