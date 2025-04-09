
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-gray-500">
          {type === "connections" 
            ? "Você ainda não tem conexões. Conecte-se com outros profissionais."
            : type === "followers"
            ? "Você ainda não tem seguidores. Compartilhe seu perfil."
            : "Você ainda não está seguindo ninguém. Procure perfis interessantes."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 py-2 max-h-80 overflow-y-auto">
      {users.map((user) => (
        <Link 
          key={user.id} 
          to={`/profile/${user.id}`} 
          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={`${user.name}'s avatar`} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-blue-500 font-semibold">
                {user.name[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-medium">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.engineering_type || "Engenharia"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
