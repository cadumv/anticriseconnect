
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface ExperienceDescriptionFieldProps {
  description: string;
  index: number;
  onUpdate: (index: number, field: keyof Experience, value: any) => void;
}

export const ExperienceDescriptionField = ({
  description,
  index,
  onUpdate
}: ExperienceDescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`description-${index}`}>Descrição</Label>
      <Textarea
        id={`description-${index}`}
        value={description}
        onChange={(e) => onUpdate(index, "description", e.target.value)}
        placeholder="Descreva suas responsabilidades e conquistas neste cargo"
        rows={3}
      />
    </div>
  );
};
