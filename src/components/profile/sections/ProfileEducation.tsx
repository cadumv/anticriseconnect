
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine, Plus } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { EducationItem } from "../form/education/EducationItem";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface ProfileEducationProps {
  user: User;
}

export const ProfileEducation = ({ user }: ProfileEducationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [education, setEducation] = useState<Education[]>(
    user.user_metadata?.education || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        description: ""
      }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducation(newEducation);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          education: education 
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          education: education
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      toast({
        title: "Formação acadêmica atualizada com sucesso",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar formação acadêmica",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEducation(user.user_metadata?.education || []);
    setIsEditing(false);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
        {!isEditing ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleAddEducation() || setIsEditing(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(true)}
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        {isEditing ? (
          <div className="space-y-6">
            {education.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Adicione sua formação acadêmica clicando no botão acima.
              </p>
            ) : (
              education.map((edu, index) => (
                <EducationItem
                  key={index}
                  education={edu}
                  index={index}
                  onRemove={handleRemoveEducation}
                  onUpdate={updateEducation}
                />
              ))
            )}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddEducation}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Adicionar formação
            </Button>
          </div>
        ) : (
          <>
            {user.user_metadata?.education && 
            user.user_metadata.education.length > 0 ? (
              <div className="space-y-6">
                {user.user_metadata.education.map((edu: any, index: number) => (
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
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma formação acadêmica adicionada
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
