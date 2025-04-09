
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ConnectionRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileName: string;
  targetProfileId: string;
  currentUserId: string;
}

export const ConnectionRequestDialog = ({ 
  isOpen, 
  onClose, 
  targetProfileName,
  targetProfileId,
  currentUserId
}: ConnectionRequestDialogProps) => {
  const [message, setMessage] = useState(`Olá ${targetProfileName}, gostaria de conectar para uma parceria profissional.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    try {
      // Save this connection request to localStorage (in a real app this would be in a DB)
      const connectionKey = `connection_requests_${currentUserId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      
      const newRequest = {
        targetId: targetProfileId,
        message,
        timestamp: new Date().toISOString(),
        status: 'pending' // 'pending', 'accepted', 'declined'
      };
      
      // Check if request already exists
      const existingRequest = requests.find((req: any) => req.targetId === targetProfileId);
      if (existingRequest) {
        toast("Solicitação já enviada para este perfil");
        setIsSubmitting(false);
        onClose();
        return;
      }
      
      // Add to the requests array
      requests.push(newRequest);
      
      // Update localStorage
      localStorage.setItem(connectionKey, JSON.stringify(requests));
      
      // Auto-accept for demo purposes (normally would wait for other user to accept)
      if (targetProfileId === "demo") {
        const updatedRequests = requests.map((req: any) => {
          if (req.targetId === targetProfileId) {
            return { ...req, status: 'accepted' };
          }
          return req;
        });
        
        localStorage.setItem(connectionKey, JSON.stringify(updatedRequests));
      }
      
      toast.success("Solicitação de conexão enviada!");
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar com {targetProfileName}</DialogTitle>
          <DialogDescription>
            Envie uma mensagem para iniciar uma parceria profissional.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sua mensagem"
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar solicitação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
