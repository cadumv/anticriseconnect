
import { EngineeringTypeSelect } from "../EngineeringTypeSelect";

interface EngineeringTypeFieldProps {
  engineeringType: string;
  setEngineeringType: (engineeringType: string) => void;
}

export const EngineeringTypeField = ({ 
  engineeringType, 
  setEngineeringType 
}: EngineeringTypeFieldProps) => {
  return (
    <EngineeringTypeSelect 
      engineeringType={engineeringType}
      setEngineeringType={setEngineeringType}
    />
  );
};
