
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

interface EducationDatesFieldProps {
  startYear: string;
  endYear: string;
  index: number;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationDatesField = ({
  startYear,
  endYear,
  index,
  onUpdate
}: EducationDatesFieldProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`startYear-${index}`}>Ano de Início</Label>
        <Select
          value={startYear}
          onValueChange={(value) => onUpdate(index, "startYear", value)}
        >
          <SelectTrigger id={`startYear-${index}`}>
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`endYear-${index}`}>Ano de Conclusão</Label>
        <Select
          value={endYear}
          onValueChange={(value) => onUpdate(index, "endYear", value)}
        >
          <SelectTrigger id={`endYear-${index}`}>
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Atual">Atual</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
