
import { Button } from "@/components/ui/button";
import { Mail, Clock } from "lucide-react";

interface ProfileContactSectionProps {
  isConnectionAccepted: boolean;
  isConnectionPending: boolean;
  onOpenConnectionDialog: () => void;
}

export const ProfileContactSection = ({
  isConnectionAccepted,
  isConnectionPending,
  onOpenConnectionDialog
}: ProfileContactSectionProps) => {
  return (
    <div className="space-y-4">
      {isConnectionAccepted ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-md">
            <p className="text-green-700 font-medium">
              Vocês já estão conectados! Agora vocês podem conversar pelo chat.
            </p>
          </div>
          
          <Button className="w-full" onClick={() => window.location.href = "/messages"}>
            <Mail className="h-4 w-4 mr-2" /> Iniciar conversa
          </Button>
        </div>
      ) : isConnectionPending ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">
              <Clock className="h-4 w-4 inline mr-2" /> Solicitação de conexão pendente. Aguardando resposta.
            </p>
          </div>
          
          <Button disabled className="w-full opacity-70">
            Aguardando resposta
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-blue-700">
              Para entrar em contato com este usuário, envie uma solicitação de conexão.
            </p>
          </div>
          
          <Button onClick={onOpenConnectionDialog} className="w-full">
            Enviar solicitação de conexão
          </Button>
        </div>
      )}
    </div>
  );
};
