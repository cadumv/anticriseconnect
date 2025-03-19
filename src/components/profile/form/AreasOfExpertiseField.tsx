
import { Label } from "@/components/ui/label";
import { AreasOfExpertise } from "../AreasOfExpertise";
import { Card, CardContent } from "@/components/ui/card";

interface AreasOfExpertiseFieldProps {
  areasOfExpertise: string[];
  updateAreasOfExpertise: (index: number, value: string) => void;
}

export const AreasOfExpertiseField = ({ 
  areasOfExpertise, 
  updateAreasOfExpertise 
}: AreasOfExpertiseFieldProps) => {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <h3 className="text-lg font-medium">Competências</h3>
          <div className="grid gap-2">
            <Label>Áreas de atuação em que atua ou possui competências técnicas</Label>
            <AreasOfExpertise 
              areasOfExpertise={areasOfExpertise} 
              updateAreasOfExpertise={updateAreasOfExpertise}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
