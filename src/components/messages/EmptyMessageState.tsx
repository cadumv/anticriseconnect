
import { MessageCircle } from "lucide-react";

interface EmptyMessageStateProps {
  searchTerm: string;
}

export const EmptyMessageState = ({ searchTerm }: EmptyMessageStateProps) => {
  return (
    <div className="py-10 text-center flex flex-col items-center gap-4">
      <MessageCircle className="h-10 w-10 text-gray-300" />
      <div className="text-muted-foreground">
        {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
      </div>
      {!searchTerm && (
        <p className="text-sm text-gray-500 max-w-xs">
          Visite os perfis dos profissionais e inicie uma conversa para conectar-se
        </p>
      )}
    </div>
  );
};
