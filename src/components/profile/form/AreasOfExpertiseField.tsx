
import { Label } from "@/components/ui/label";
import { AreasOfExpertise } from "../AreasOfExpertise";

interface AreasOfExpertiseFieldProps {
  areasOfExpertise: string[];
  updateAreasOfExpertise: (index: number, value: string) => void;
}

export const AreasOfExpertiseField = ({ 
  areasOfExpertise, 
  updateAreasOfExpertise 
}: AreasOfExpertiseFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label>Áreas de atuação em que atua ou gostaria de atuar</Label>
      <AreasOfExpertise 
        areasOfExpertise={areasOfExpertise} 
        updateAreasOfExpertise={updateAreasOfExpertise}
      />
    </div>
  );
};
