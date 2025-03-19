
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationFieldOfStudyFieldProps {
  fieldOfStudy: string;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationFieldOfStudyField = ({
  fieldOfStudy,
  index,
  onUpdate
}: EducationFieldOfStudyFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`fieldOfStudy-${index}`}>Área de Estudo</Label>
      <Input
        id={`fieldOfStudy-${index}`}
        value={fieldOfStudy}
        onChange={(e) => onUpdate(index, "fieldOfStudy", e.target.value)}
        placeholder="Ex: Engenharia Civil"
      />
    </div>
  );
};
