
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationDescriptionFieldProps {
  description: string;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationDescriptionField = ({
  description,
  index,
  onUpdate
}: EducationDescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`description-${index}`}>Descrição</Label>
      <Textarea
        id={`description-${index}`}
        value={description}
        onChange={(e) => onUpdate(index, "description", e.target.value)}
        placeholder="Descreva sua experiência acadêmica, projetos relevantes, etc."
        rows={3}
      />
    </div>
  );
};
