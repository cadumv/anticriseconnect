
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial message when dialog opens
  useEffect(() => {
    if (isOpen) {
      setMessage(`Olá ${targetProfileName}, gostaria de conectar para uma parceria profissional.`);
    }
  }, [isOpen, targetProfileName]);
  
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
      
      // Create a notification for the recipient
      createNotificationForRecipient(targetProfileId, currentUserId, message);
      
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
      
      // Force window to reload to update connection status throughout the UI
      window.location.reload();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };
  
  // Function to create a notification for the recipient
  const createNotificationForRecipient = (recipientId: string, senderId: string, requestMessage: string) => {
    try {
      // Get the sender's name from localStorage or fetch it from the database
      // For demo purposes, we'll use a placeholder
      let senderName = "Usuário";
      
      // Try to get sender profile from localStorage
      const senderProfileData = localStorage.getItem(`profile_${senderId}`);
      if (senderProfileData) {
        const senderProfile = JSON.parse(senderProfileData);
        senderName = senderProfile.name || senderName;
      }
      
      // Create a notification
      const notificationKey = `notifications_${recipientId}`;
      const existingNotifications = localStorage.getItem(notificationKey);
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      const newNotification = {
        id: uuidv4(),
        type: "partnership",
        message: `${senderName} enviou uma solicitação de conexão para você: "${requestMessage.substring(0, 50)}${requestMessage.length > 50 ? '...' : ''}"`,
        read: false,
        date: new Date().toISOString(),
        link: `/profile/${senderId}`,
        senderId: senderId
      };
      
      notifications.push(newNotification);
      localStorage.setItem(notificationKey, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error creating notification:', error);
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
