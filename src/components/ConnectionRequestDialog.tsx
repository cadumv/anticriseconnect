
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ConnectionRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileName: string;
  targetProfileId: string;
  currentUserId: string;
}

export function ConnectionRequestDialog({
  isOpen,
  onClose,
  targetProfileName,
  targetProfileId,
  currentUserId,
}: ConnectionRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // For demonstration purposes, we'll store connection requests in localStorage
      const storageKey = `connection_requests_${currentUserId}`;
      let requests = [];
      
      const existingRequests = localStorage.getItem(storageKey);
      if (existingRequests) {
        requests = JSON.parse(existingRequests);
      }
      
      // Add new request if it doesn't exist
      if (!requests.find((req: any) => req.targetId === targetProfileId)) {
        requests.push({
          targetId: targetProfileId,
          targetName: targetProfileName,
          requestedAt: new Date().toISOString(),
          status: 'pending'
        });
        
        localStorage.setItem(storageKey, JSON.stringify(requests));
      }
      
      // Show success message
      toast.success(`Solicitação de conexão enviada para ${targetProfileName}`);
      onClose();
    } catch (error) {
      console.error("Erro ao enviar solicitação de conexão:", error);
      toast.error("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conexão Anticrise</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Parabéns! Você acabou de realizar uma conexão Anticrise. 
            Assim que <strong>{targetProfileName}</strong> aceitar, você receberá uma mensagem.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
