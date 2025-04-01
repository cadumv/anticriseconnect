
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectionUser } from "@/utils/connectionUtils";
import { ConnectionType } from "./ConnectionTypeIcon";

interface ConnectionUserListProps {
  users: ConnectionUser[];
  loading: boolean;
  type: ConnectionType;
}

export const ConnectionUserList = ({ users, loading, type }: ConnectionUserListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        {type === "connections" && "Nenhuma conexão encontrada."}
        {type === "followers" && "Nenhum seguidor encontrado."}
        {type === "following" && "Não está seguindo ninguém."}
      </div>
    );
  }
  
  return (
    <div className="mt-4 space-y-4">
      {users.map(user => (
        <Link 
          key={user.id} 
          to={`/profile/${user.id}`}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md block"
        >
          <Avatar className="w-10 h-10">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name} style={{ objectFit: "contain" }} />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-500">
                {user.name[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.engineering_type || "Engenheiro(a)"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
