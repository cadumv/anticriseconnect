
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationDegreeFieldProps {
  degree: string;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationDegreeField = ({
  degree,
  index,
  onUpdate
}: EducationDegreeFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`degree-${index}`}>Grau</Label>
      <Select
        value={degree}
        onValueChange={(value) => onUpdate(index, "degree", value)}
      >
        <SelectTrigger id={`degree-${index}`}>
          <SelectValue placeholder="Selecione o grau" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Bacharelado">Bacharelado</SelectItem>
          <SelectItem value="Licenciatura">Licenciatura</SelectItem>
          <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
          <SelectItem value="Especialização">Especialização</SelectItem>
          <SelectItem value="MBA">MBA</SelectItem>
          <SelectItem value="Mestrado">Mestrado</SelectItem>
          <SelectItem value="Doutorado">Doutorado</SelectItem>
          <SelectItem value="Técnico">Técnico</SelectItem>
          <SelectItem value="Curso Livre">Curso Livre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
