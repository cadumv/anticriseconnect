
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareOptionsProps {
  postId: string;
  onShare: (postId: string) => void;
  onClose?: () => void;
}

export function ShareOptions({ postId, onShare, onClose }: ShareOptionsProps) {
  const handleGenerateLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("Link copiado para a área de transferência");
        if (onClose) onClose();
      })
      .catch(() => {
        toast.error("Não foi possível copiar o link");
      });
  };
  
  const handleShareWithContacts = () => {
    onShare(postId);
    if (onClose) onClose();
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Compartilhar publicação</h4>
      <div className="grid gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShareWithContacts}
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
  );
}
