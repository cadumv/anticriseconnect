
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditPostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const EditPostDialog = ({
  isOpen,
  onOpenChange,
  content,
  onChange,
  onSave,
  isSubmitting,
  onCancel
}: EditPostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar publicação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="O que você gostaria de compartilhar?"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSave}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
