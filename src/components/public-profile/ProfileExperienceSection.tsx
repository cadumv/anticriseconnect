
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Experience } from "@/types/profile";

interface ProfileExperienceSectionProps {
  experiences: Experience[];
}

export const ProfileExperienceSection = ({ experiences }: ProfileExperienceSectionProps) => {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Experiência profissional</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-semibold text-sm">
                  {exp.company ? exp.company.substring(0, 3).toUpperCase() : "EXP"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{exp.position || "Cargo não informado"}</h3>
                <p className="text-sm text-gray-700">{exp.company || "Empresa não informada"}</p>
                <p className="text-xs text-gray-500">
                  {exp.startMonth && exp.startYear ? 
                    `${exp.startMonth}/${exp.startYear} - ${exp.current ? 'Atual' : 
                    (exp.endMonth && exp.endYear ? `${exp.endMonth}/${exp.endYear}` : 'Fim não informado')}` : 
                    "Período não informado"}
                </p>
                {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
