
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

interface ProfileHeaderInfoProps {
  user: User | null;
}

export const ProfileHeaderInfo = ({ user }: ProfileHeaderInfoProps) => {
  return (
    <div className="flex-1 text-center sm:text-left">
      <div>
        {user?.user_metadata?.engineering_type && (
          <Badge className="mb-2">{user.user_metadata.engineering_type}</Badge>
        )}
        <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h1>
        {user?.user_metadata?.username && (
          <div className="flex items-center text-gray-600 mt-1">
            <AtSign className="h-4 w-4 mr-1" />
            <span>{user.user_metadata.username}</span>
          </div>
        )}
      </div>
      
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
  );
};
