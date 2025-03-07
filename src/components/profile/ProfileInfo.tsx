
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface ProfileInfoProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileInfo = ({ user, setIsEditingProfile }: ProfileInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Nome</h3>
          <p>{user.user_metadata?.name || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Tipo de Engenharia</h3>
          <p>{user.user_metadata?.engineering_type || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Descrição profissional</h3>
          <p>{user.user_metadata?.professional_description || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Áreas de atuação</h3>
          {user.user_metadata?.areas_of_expertise && 
            user.user_metadata.areas_of_expertise.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                area && <li key={index}>{area}</li>
              ))}
            </ul>
          ) : (
            <p>Não informado</p>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium">Telefone</h3>
          <p>{user.user_metadata?.phone || "Não informado"}</p>
        </div>
      </div>
      
      <Button onClick={() => setIsEditingProfile(true)}>Editar perfil</Button>
    </div>
  );
};
