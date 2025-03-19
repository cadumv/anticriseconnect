
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

interface EducationInstitutionFieldProps {
  institution: string;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationInstitutionField = ({
  institution,
  index,
  onUpdate
}: EducationInstitutionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`institution-${index}`}>Instituição</Label>
      <Input
        id={`institution-${index}`}
        value={institution}
        onChange={(e) => onUpdate(index, "institution", e.target.value)}
        placeholder="Ex: Universidade Federal de São Paulo"
      />
    </div>
  );
};
