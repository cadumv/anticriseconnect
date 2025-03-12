
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { AtSign } from "lucide-react";

interface ProfileInfoProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileInfo = ({ user, setIsEditingProfile }: ProfileInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Nome</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            {user.user_metadata?.name || "Não informado"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Nome de usuário</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 flex items-center">
            {user.user_metadata?.username ? (
              <>
                <AtSign className="h-4 w-4 mr-1 text-gray-500" />
                {user.user_metadata.username}
              </>
            ) : (
              "Não informado"
            )}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Tipo de Engenharia</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            {user.user_metadata?.engineering_type || "Não informado"}
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700">Descrição profissional</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 min-h-[70px]">
            {user.user_metadata?.professional_description || "Não informado"}
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700">Áreas de atuação</h3>
          {user.user_metadata?.areas_of_expertise && 
            user.user_metadata.areas_of_expertise.length > 0 ? (
            <div className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
              <ul className="list-disc list-inside space-y-1">
                {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                  area && <li key={index} className="text-base">{area}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
              Não informado
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Telefone</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            {user.user_metadata?.phone || "Não informado"}
          </p>
        </div>
      </div>
      
      <Button 
        onClick={() => setIsEditingProfile(true)}
        className="w-full sm:w-auto"
      >
        Editar perfil
      </Button>
    </div>
  );
};
