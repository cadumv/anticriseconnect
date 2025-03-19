
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine, Plus } from "lucide-react";
import { ProfileExperienceProps } from "./experience/types";
import { ExperienceEditList } from "./experience/ExperienceEditList";
import { ExperienceViewList } from "./experience/ExperienceViewList";
import { useExperience } from "./experience/useExperience";

export const ProfileExperience = ({ user }: ProfileExperienceProps) => {
  const {
    isEditing,
    setIsEditing,
    experiences,
    isSaving,
    handleAddExperience,
    handleRemoveExperience,
    updateExperience,
    handleSave,
    handleCancel
  } = useExperience(user);

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
          <ExperienceEditList
            experiences={experiences}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
            updateExperience={updateExperience}
          />
        ) : (
          <ExperienceViewList 
            experienceList={user.user_metadata?.experiences || []} 
          />
        )}
      </CardContent>
    </Card>
  );
};
