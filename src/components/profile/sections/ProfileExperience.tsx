
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine, Plus } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ExperienceItem } from "../form/experience/ExperienceItem";

interface Experience {
  company: string;
  position: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

interface ProfileExperienceProps {
  user: User;
}

export const ProfileExperience = ({ user }: ProfileExperienceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>(
    user.user_metadata?.experiences || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        description: ""
      }
    ]);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    setExperiences(newExperiences);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          experiences: experiences 
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          experiences: experiences
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      toast({
        title: "Experiência profissional atualizada com sucesso",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar experiência profissional",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setExperiences(user.user_metadata?.experiences || []);
    setIsEditing(false);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Experiência profissional</CardTitle>
        {!isEditing ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleAddExperience}
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
            {experiences.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Adicione sua experiência profissional clicando no botão acima.
              </p>
            ) : (
              experiences.map((exp, index) => (
                <ExperienceItem
                  key={index}
                  experience={exp}
                  index={index}
                  onRemove={handleRemoveExperience}
                  onUpdate={updateExperience}
                />
              ))
            )}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddExperience}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Adicionar experiência
            </Button>
          </div>
        ) : (
          <>
            {user.user_metadata?.experiences && 
            user.user_metadata.experiences.length > 0 ? (
              <div className="space-y-6">
                {user.user_metadata.experiences.map((exp: any, index: number) => (
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
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma experiência profissional adicionada
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
