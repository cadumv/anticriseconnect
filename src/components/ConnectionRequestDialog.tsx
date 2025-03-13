
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
import { AchievementsManager } from "@/services/AchievementsManager";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import { updateConnectionMissionProgress } from "@/components/achievements/utils/missionUtils";

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
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [showMissionCompletePopup, setShowMissionCompletePopup] = useState(false);
  
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
      
      // Make sure we have a record of all users for achievement checking
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
      if (!allUsers.includes(currentUserId)) {
        allUsers.push(currentUserId);
        localStorage.setItem('all_users', JSON.stringify(allUsers));
      }
      if (!allUsers.includes(targetProfileId)) {
        allUsers.push(targetProfileId);
        localStorage.setItem('all_users', JSON.stringify(allUsers));
      }
      
      // Update mission progress for connections
      const { currentProgress, requiredProgress, missionCompleted } = updateConnectionMissionProgress(currentUserId);
      
      // Show progress notification
      if (!missionCompleted) {
        const remaining = requiredProgress - currentProgress;
        toast.success(`Parabéns, você realizou uma nova conexão. Faltam apenas ${remaining} para você completar a missão.`);
      } else {
        // Show mission complete popup
        setShowMissionCompletePopup(true);
      }
      
      // Check if the user has unlocked any achievements
      const achievement = AchievementsManager.checkConnectionsAchievement(currentUserId);
      if (achievement) {
        setAchievementUnlocked(achievement);
        setShowAchievementPopup(true);
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

  const handleShareAchievement = () => {
    if (achievementUnlocked && currentUserId) {
      AchievementsManager.shareAchievement(currentUserId, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };
  
  return (
    <>
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
      
      {/* Achievement Popup */}
      {achievementUnlocked && showAchievementPopup && (
        <AchievementPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)}
          userName={localStorage.getItem(`user_name_${currentUserId}`) || ""}
          achievementTitle={achievementUnlocked.title}
          onShare={handleShareAchievement}
        />
      )}

      {/* Mission Complete Popup */}
      {showMissionCompletePopup && (
        <Dialog open={showMissionCompletePopup} onOpenChange={() => setShowMissionCompletePopup(false)}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
              </div>
              <DialogTitle className="text-xl">PARABÉNS!</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Você completou a missão "Faça 20 novas conexões com engenheiros" e ganhou 100 pontos!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
