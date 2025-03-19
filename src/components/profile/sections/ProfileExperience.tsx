
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ProfileExperienceProps {
  user: User;
}

export const ProfileExperience = ({ user }: ProfileExperienceProps) => {
  // Format date helper function
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
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Experiência</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-lg font-semibold">+</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        {user.user_metadata?.experiences && 
         user.user_metadata.experiences.length > 0 ? (
          <div className="space-y-6">
            {user.user_metadata.experiences.map((exp: any, index: number) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">FSW</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{exp.position || "Cargo não informado"}</h3>
                  <p className="text-sm text-gray-700">{exp.company || "Empresa não informada"}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startMonth && exp.startYear ? formatExperienceDate(exp) : "Período não informado"}
                  </p>
                  {exp.location && <p className="text-xs text-gray-600 mt-0.5">{exp.location}</p>}
                  
                  {/* Skills/Competencies */}
                  {exp.description && (
                    <div className="mt-2">
                      <ul className="list-disc list-inside text-xs text-gray-700 pl-1">
                        <li>{exp.description}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Nenhuma experiência adicionada
          </p>
        )}
      </CardContent>
    </Card>
  );
};
