
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { engineeringTypes } from "@/constants/engineering-types";

interface EngineeringTypeSelectProps {
  engineeringType: string;
  setEngineeringType: (type: string) => void;
}

export const EngineeringTypeSelect = ({ engineeringType, setEngineeringType }: EngineeringTypeSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="engineering-type">Tipo de Engenharia</Label>
      <Select 
        value={engineeringType} 
        onValueChange={setEngineeringType}
      >
        <SelectTrigger id="engineering-type">
          <SelectValue placeholder="Selecione o tipo de engenharia" />
        </SelectTrigger>
        <SelectContent>
          {engineeringTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
