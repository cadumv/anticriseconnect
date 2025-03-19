
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EducationItem } from "./EducationItem";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationListProps {
  education: Education[];
  updateEducation: (index: number, field: keyof Education, value: string) => void;
  handleAddEducation: () => void;
  handleRemoveEducation: (index: number) => void;
}

export const EducationList = ({
  education,
  updateEducation,
  handleAddEducation,
  handleRemoveEducation
}: EducationListProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Formação Acadêmica</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddEducation}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {education.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Adicione sua formação acadêmica clicando no botão acima.
        </p>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <EducationItem
              key={index}
              education={edu}
              index={index}
              onRemove={handleRemoveEducation}
              onUpdate={updateEducation}
            />
          ))}
        </div>
      )}
    </>
  );
};
