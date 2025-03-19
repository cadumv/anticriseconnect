
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExperienceItem } from "../../form/experience/ExperienceItem";
import { Experience } from "./types";

interface ExperienceEditListProps {
  experiences: Experience[];
  handleAddExperience: () => void;
  handleRemoveExperience: (index: number) => void;
  updateExperience: (index: number, field: keyof Experience, value: any) => void;
}

export const ExperienceEditList: React.FC<ExperienceEditListProps> = ({
  experiences,
  handleAddExperience,
  handleRemoveExperience,
  updateExperience
}) => {
  return (
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
  );
};
