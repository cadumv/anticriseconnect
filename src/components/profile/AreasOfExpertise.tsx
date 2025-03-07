
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AreasOfExpertiseProps {
  areasOfExpertise: string[];
  updateAreasOfExpertise: (index: number, value: string) => void;
}

export const AreasOfExpertise = ({ areasOfExpertise, updateAreasOfExpertise }: AreasOfExpertiseProps) => {
  return (
    <div className="space-y-2">
      {areasOfExpertise.map((area, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={area}
            onChange={(e) => updateAreasOfExpertise(index, e.target.value)}
            placeholder={`Área ${index + 1}`}
          />
          {area && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => updateAreasOfExpertise(index, "")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
