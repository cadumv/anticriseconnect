
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
      // Get the sender's profile information for the notification
      let senderName = "Usuário";
      const senderProfileData = localStorage.getItem(`profile_${currentUserId}`);
      if (senderProfileData) {
        const senderProfile = JSON.parse(senderProfileData);
        senderName = senderProfile.name || senderName;
      }
      
      // Save this connection request to localStorage (in a real app this would be in a DB)
      const connectionKey = `connection_requests_${currentUserId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      
      const newRequest = {
        targetId: targetProfileId,
        message,
        timestamp: new Date().toISOString(),
        status: 'pending', // 'pending', 'accepted', 'declined'
        senderName: senderName
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
      createNotificationForRecipient(targetProfileId, currentUserId, message, senderName);
      
      // Also create a notification for the sender to track the request
      createNotificationForSender(currentUserId, targetProfileId, targetProfileName);
      
      toast.success("Solicitação de conexão enviada!");
      
      // Close the dialog - don't reload the page to maintain state
      setIsSubmitting(false);
      onClose();
      
      // Force reload to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error("Erro ao enviar solicitação");
      setIsSubmitting(false);
      onClose();
    }
  };
  
  // Function to create a notification for the recipient
  const createNotificationForRecipient = (recipientId: string, senderId: string, requestMessage: string, senderName: string) => {
    try {
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
      
      console.log(`Notification created for user ${recipientId} from sender ${senderId}`);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };
  
  // Function to create a notification for the sender to track the request
  const createNotificationForSender = (senderId: string, targetId: string, targetName: string) => {
    try {
      // Create a notification
      const notificationKey = `notifications_${senderId}`;
      const existingNotifications = localStorage.getItem(notificationKey);
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      const newNotification = {
        id: uuidv4(),
        type: "partnership",
        message: `Você enviou uma solicitação de conexão para ${targetName}. Aguardando resposta.`,
        read: false,
        date: new Date().toISOString(),
        link: `/profile/${targetId}`,
        senderId: senderId  // In this case, the sender is also the owner of the notification
      };
      
      notifications.push(newNotification);
      localStorage.setItem(notificationKey, JSON.stringify(notifications));
      
      console.log(`Notification created for sender ${senderId} about target ${targetId}`);
    } catch (error) {
      console.error('Error creating sender notification:', error);
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
