
import { EngineeringTypeSelect } from "../EngineeringTypeSelect";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface EngineeringTypeFieldProps {
  engineeringType: string;
  setEngineeringType: (engineeringType: string) => void;
}

export const EngineeringTypeField = ({ 
  engineeringType, 
  setEngineeringType 
}: EngineeringTypeFieldProps) => {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <h3 className="text-lg font-medium">Sobre</h3>
          <EngineeringTypeSelect 
            engineeringType={engineeringType}
            setEngineeringType={setEngineeringType}
          />
        </div>
      </CardContent>
    </Card>
  );
};
