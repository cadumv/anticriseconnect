
import { Handshake, Users, UserPlus } from "lucide-react";

export type ConnectionType = "connections" | "followers" | "following";

interface ConnectionTypeIconProps {
  type: ConnectionType;
}

export const ConnectionTypeIcon = ({ type }: ConnectionTypeIconProps) => {
  switch (type) {
    case "connections":
      return <Handshake className="h-4 w-4 text-blue-500" />;
    case "followers":
      return <Users className="h-4 w-4 text-blue-500" />;
    case "following":
      return <UserPlus className="h-4 w-4 text-blue-500" />;
  }
};

export const getConnectionTypeTitle = (type: ConnectionType): string => {
  switch (type) {
    case "connections": return "Conexões";
    case "followers": return "Seguidores";
    case "following": return "Seguindo";
  }
};

export const getConnectionTypeDescription = (type: ConnectionType): string => {
  switch (type) {
    case "connections": return "Pessoas que se conectaram com você para trocas anticrise.";
    case "followers": return "Pessoas que seguem seu perfil.";
    case "following": return "Perfis que você segue.";
  }
};
