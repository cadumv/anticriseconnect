
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatDialog } from "@/components/chat-dialog/ChatDialog";

interface ProfileContactProps {
  profileId: string;
  profileName: string;
  isConnectionAccepted: boolean;
}

export const ProfileContact = ({ profileId, profileName, isConnectionAccepted }: ProfileContactProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="pt-4 border-t text-left">
      <h3 className="text-base font-semibold mb-2">Contato</h3>
      <div className="flex items-center">
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-2"
          disabled={!isConnectionAccepted}
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="h-4 w-4" /> 
          Enviar mensagem
        </Button>
        {!isConnectionAccepted && (
          <span className="text-xs text-gray-500 ml-2">
            (Disponível após aceite da conexão)
          </span>
        )}
      </div>

      {isConnectionAccepted && (
        <ChatDialog 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          recipientId={profileId}
          recipientName={profileName}
        />
      )}
    </div>
  );
};
