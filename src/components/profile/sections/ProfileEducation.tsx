
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ProfileEducationProps {
  user: User;
}

export const ProfileEducation = ({ user }: ProfileEducationProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
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
        {user.user_metadata?.education && 
         user.user_metadata.education.length > 0 ? (
          <div className="space-y-6">
            {user.user_metadata.education.map((edu: any, index: number) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-amber-600 font-semibold text-sm">
                    {edu.institution ? edu.institution.substring(0, 3) : "EDU"}
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
        ) : (
          <p className="text-sm text-gray-500">
            Nenhuma formação acadêmica adicionada
          </p>
        )}
      </CardContent>
    </Card>
  );
};
