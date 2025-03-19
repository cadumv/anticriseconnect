
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine, Plus } from "lucide-react";
import { ProfileEducationProps } from "./education/types";
import { EducationEditList } from "./education/EducationEditList";
import { EducationViewList } from "./education/EducationViewList";
import { useEducation } from "./education/useEducation";

export const ProfileEducation = ({ user }: ProfileEducationProps) => {
  const {
    isEditing,
    setIsEditing,
    education,
    isSaving,
    handleAddEducation,
    handleRemoveEducation,
    updateEducation,
    handleSave,
    handleCancel
  } = useEducation(user);

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
              onClick={handleAddEducation}
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
          <EducationEditList
            education={education}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            updateEducation={updateEducation}
          />
        ) : (
          <EducationViewList 
            educationList={user.user_metadata?.education || []} 
          />
        )}
      </CardContent>
    </Card>
  );
};
