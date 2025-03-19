
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ExperienceItem } from "./ExperienceItem";

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

interface ExperienceListProps {
  experiences: Experience[];
  updateExperience: (index: number, field: keyof Experience, value: any) => void;
  handleAddExperience: () => void;
  handleRemoveExperience: (index: number) => void;
}

export const ExperienceList = ({
  experiences,
  updateExperience,
  handleAddExperience,
  handleRemoveExperience
}: ExperienceListProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experiência</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddExperience}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {experiences.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Adicione sua experiência profissional clicando no botão acima.
        </p>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <ExperienceItem
              key={index}
              experience={exp}
              index={index}
              onRemove={handleRemoveExperience}
              onUpdate={updateExperience}
            />
          ))}
        </div>
      )}
    </>
  );
};
