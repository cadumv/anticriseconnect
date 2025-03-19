
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { AtSign } from "lucide-react";

interface ProfileInfoProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileInfo = ({ user, setIsEditingProfile }: ProfileInfoProps) => {
  const formatDate = (month: string, year: string) => {
    if (!month || !year) return "";
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} de ${year}`;
  };

  const formatExperienceDate = (experience: any) => {
    const startDate = formatDate(experience.startMonth, experience.startYear);
    if (experience.current) {
      return `${startDate} - Atual`;
    }
    const endDate = formatDate(experience.endMonth, experience.endYear);
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="space-y-8">
      {/* Dados Pessoais */}
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
            <h3 className="text-sm font-semibold text-gray-700">Telefone</h3>
            <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
              {user.user_metadata?.phone || "Não informado"}
            </p>
          </div>
        </div>
      </div>

      {/* Sobre - Tipo de Engenharia */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Sobre</h2>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Tipo de Engenharia</h3>
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            {user.user_metadata?.engineering_type || "Não informado"}
          </p>
        </div>
      </div>
      
      {/* Descrição profissional */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Descrição profissional</h2>
        <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 min-h-[70px]">
          {user.user_metadata?.professional_description || "Não informado"}
        </p>
      </div>

      {/* Experiência */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Experiência</h2>
        {user.user_metadata?.experiences && 
         user.user_metadata.experiences.length > 0 ? (
          <div className="space-y-4">
            {user.user_metadata.experiences.map((exp: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
                <h3 className="font-semibold">{exp.position || "Cargo não informado"}</h3>
                <p className="text-gray-700">{exp.company || "Empresa não informada"}</p>
                <p className="text-sm text-gray-500">
                  {exp.startMonth && exp.startYear ? formatExperienceDate(exp) : "Período não informado"}
                </p>
                {exp.location && <p className="text-sm text-gray-600 mt-1">{exp.location}</p>}
                {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            Nenhuma experiência informada
          </p>
        )}
      </div>

      {/* Formação Acadêmica */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Formação Acadêmica</h2>
        {user.user_metadata?.education && 
         user.user_metadata.education.length > 0 ? (
          <div className="space-y-4">
            {user.user_metadata.education.map((edu: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
                <h3 className="font-semibold">{edu.institution || "Instituição não informada"}</h3>
                <p className="text-gray-700">
                  {edu.degree && edu.fieldOfStudy ? `${edu.degree} em ${edu.fieldOfStudy}` : 
                   edu.degree ? edu.degree : 
                   edu.fieldOfStudy ? edu.fieldOfStudy : "Curso não informado"}
                </p>
                <p className="text-sm text-gray-500">
                  {edu.startYear && edu.endYear ? 
                    `${edu.startYear} - ${edu.endYear === "Atual" ? "Atual" : edu.endYear}` : 
                    "Período não informado"}
                </p>
                {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            Nenhuma formação acadêmica informada
          </p>
        )}
      </div>

      {/* Competências - Áreas de atuação */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Competências</h2>
        {user.user_metadata?.areas_of_expertise && 
          user.user_metadata.areas_of_expertise.length > 0 ? (
          <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
            <ul className="list-disc list-inside space-y-1">
              {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                area && <li key={index} className="text-base">{area}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            Nenhuma competência informada
          </p>
        )}
      </div>

      {/* Interesses */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold">Interesses</h2>
        {user.user_metadata?.interests && 
          user.user_metadata.interests.length > 0 ? (
          <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
            <ul className="list-disc list-inside space-y-1">
              {user.user_metadata.interests.map((interest: string, index: number) => (
                interest && <li key={index} className="text-base">{interest}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
            Nenhum interesse informado
          </p>
        )}
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
