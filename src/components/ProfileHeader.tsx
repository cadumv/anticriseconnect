
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const ProfileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-3xl font-bold text-blue-500">
            {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h1>
          <p className="text-gray-500">{user?.email}</p>
          
          {user ? (
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Link to="/profile">
                <Button size="sm" variant="outline">Editar Perfil</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Link to="/login">
                <Button size="sm" variant="default">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
