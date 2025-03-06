
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const ProfileHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-blue-500">
              {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          {user?.user_metadata?.engineering_type && (
            <Badge className="mb-2">{user.user_metadata.engineering_type}</Badge>
          )}
          <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h1>
          
          {user?.user_metadata?.professional_description && (
            <p className="mt-2 text-sm text-gray-700">{user.user_metadata.professional_description}</p>
          )}
          
          {user?.user_metadata?.areas_of_expertise && user.user_metadata.areas_of_expertise.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Áreas de atuação:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                  area && <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          
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
