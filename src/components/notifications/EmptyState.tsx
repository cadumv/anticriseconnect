
import React from "react";
import { AtSign, Handshake } from "lucide-react";

interface EmptyStateProps {
  type: "mention" | "partnership";
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  const icons = {
    mention: <AtSign className="h-8 w-8 mx-auto mb-2 text-gray-300" />,
    partnership: <Handshake className="h-8 w-8 mx-auto mb-2 text-gray-300" />
  };

  const messages = {
    mention: {
      title: "Nenhuma menção recente",
      description: "Quando alguém mencionar você, as notificações aparecerão aqui."
    },
    partnership: {
      title: "Nenhuma solicitação de parceria",
      description: "Quando alguém solicitar uma parceria, as notificações aparecerão aqui."
    }
  };

  return (
    <div className="text-center py-8 text-gray-500">
      {icons[type]}
      <p>{messages[type].title}</p>
      <p className="text-sm text-gray-400 mt-1">
        {messages[type].description}
      </p>
    </div>
  );
};
