
import { MessageCircle } from "lucide-react";

export function EmptyConversation() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-4">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Suas mensagens</h3>
        <p className="text-gray-500 max-w-xs">
          Selecione uma conversa ou inicie uma nova a partir de um perfil profissional
        </p>
      </div>
    </div>
  );
}
