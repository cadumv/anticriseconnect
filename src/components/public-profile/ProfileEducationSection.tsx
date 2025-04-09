
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Education } from "@/types/profile";

interface ProfileEducationSectionProps {
  education: Education[];
}

export const ProfileEducationSection = ({ education }: ProfileEducationSectionProps) => {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                <span className="text-amber-600 font-semibold text-sm">
                  {edu.institution ? edu.institution.substring(0, 3).toUpperCase() : "EDU"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{edu.institution || "Instituição não informada"}</h3>
                <p className="text-sm text-gray-700">
                  {edu.degree && edu.fieldOfStudy ? `${edu.degree} em ${edu.fieldOfStudy}` : 
                  edu.degree ? edu.degree : 
                  edu.fieldOfStudy ? edu.fieldOfStudy : "Curso não informado"}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.startYear && edu.endYear ? 
                    `${edu.startYear} - ${edu.endYear === "Atual" ? "Atual" : edu.endYear}` : 
                    "Período não informado"}
                </p>
                {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
