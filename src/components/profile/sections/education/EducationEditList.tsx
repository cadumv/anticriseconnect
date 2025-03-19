
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EducationItem } from "../../form/education/EducationItem";
import { Education } from "./types";

interface EducationEditListProps {
  education: Education[];
  handleAddEducation: () => void;
  handleRemoveEducation: (index: number) => void;
  updateEducation: (index: number, field: keyof Education, value: string) => void;
}

export const EducationEditList: React.FC<EducationEditListProps> = ({
  education,
  handleAddEducation,
  handleRemoveEducation,
  updateEducation
}) => {
  return (
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
  );
};
