
import { useState, useEffect } from "react";
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
  const [existingRequest, setExistingRequest] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkExistingRequest();
    }
  }, [isOpen, targetProfileId, currentUserId]);

  const checkExistingRequest = () => {
    const storageKey = `connection_requests_${currentUserId}`;
    const existingRequests = localStorage.getItem(storageKey);
    
    if (existingRequests) {
      const requests = JSON.parse(existingRequests);
      const existing = requests.find((req: any) => req.targetId === targetProfileId);
      setExistingRequest(!!existing);
    } else {
      setExistingRequest(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (existingRequest) {
        toast.info(`Você já enviou uma solicitação para ${targetProfileName}`);
        onClose();
        return;
      }
      
      // Store connection request in localStorage for demonstration
      // In a real app, this would be sent to your backend/database
      const storageKey = `connection_requests_${currentUserId}`;
      let requests = [];
      
      const existingRequests = localStorage.getItem(storageKey);
      if (existingRequests) {
        requests = JSON.parse(existingRequests);
      }
      
      // Add new request
      requests.push({
        targetId: targetProfileId,
        targetName: targetProfileName,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      localStorage.setItem(storageKey, JSON.stringify(requests));
      
      // For demonstration, we'll also immediately add an "accepted" status in the target's connections
      // This simulates the user accepting the request so we can test the messaging feature
      const targetStorageKey = `connection_requests_${targetProfileId}`;
      let targetRequests = [];
      
      const existingTargetRequests = localStorage.getItem(targetStorageKey);
      if (existingTargetRequests) {
        targetRequests = JSON.parse(existingTargetRequests);
      }
      
      // For demo purposes - simulate immediate acceptance
      targetRequests.push({
        targetId: currentUserId,
        requestedAt: new Date().toISOString(),
        status: 'accepted'
      });
      
      localStorage.setItem(targetStorageKey, JSON.stringify(targetRequests));
      
      // Show success message
      toast.success(`Solicitação de conexão enviada para ${targetProfileName}`);
      onClose();
      
      // Refresh the page to show the updated connection status
      window.location.reload();
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
