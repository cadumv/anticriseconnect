
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

interface ExperienceLocationFieldProps {
  location: string;
  index: number;
  onUpdate: (index: number, field: keyof Experience, value: any) => void;
}

export const ExperienceLocationField = ({
  location,
  index,
  onUpdate
}: ExperienceLocationFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`location-${index}`}>Localização</Label>
      <Input
        id={`location-${index}`}
        value={location}
        onChange={(e) => onUpdate(index, "location", e.target.value)}
        placeholder="Ex: São Paulo, SP"
      />
    </div>
  );
};
