
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface ExperienceDateSelectorProps {
  experience: Experience;
  index: number;
  onUpdate: (index: number, field: keyof Experience, value: any) => void;
}

export const ExperienceDateSelector = ({ 
  experience, 
  index, 
  onUpdate 
}: ExperienceDateSelectorProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Data de Início</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={experience.startMonth}
            onValueChange={(value) => onUpdate(index, "startMonth", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, i) => (
                <SelectItem key={month} value={(i + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={experience.startYear}
            onValueChange={(value) => onUpdate(index, "startYear", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
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
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Data de Término</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor={`current-${index}`} className="text-sm font-normal">
              Cargo atual
            </Label>
            <input
              type="checkbox"
              id={`current-${index}`}
              checked={experience.current}
              onChange={(e) => onUpdate(index, "current", e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        </div>
        {!experience.current && (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={experience.endMonth}
              onValueChange={(value) => onUpdate(index, "endMonth", value)}
              disabled={experience.current}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, i) => (
                  <SelectItem key={month} value={(i + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={experience.endYear}
              onValueChange={(value) => onUpdate(index, "endYear", value)}
              disabled={experience.current}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
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
        )}
      </div>
    </div>
  );
};
