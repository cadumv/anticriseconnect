
import { Label } from "@/components/ui/label";
import { AreasOfExpertise } from "./AreasOfExpertise";
import { EngineeringTypeSelect } from "./EngineeringTypeSelect";
import { ProfileDescriptionGenerator } from "./ProfileDescriptionGenerator";

interface ProfessionalInfoFieldsProps {
  engineeringType: string;
  setEngineeringType: (engineeringType: string) => void;
  areasOfExpertise: string[];
  updateAreasOfExpertise: (index: number, value: string) => void;
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
}

export const ProfessionalInfoFields = ({
  engineeringType,
  setEngineeringType,
  areasOfExpertise,
  updateAreasOfExpertise,
  professionalDescription,
  setProfessionalDescription
}: ProfessionalInfoFieldsProps) => {
  return (
    <>
      <EngineeringTypeSelect 
        engineeringType={engineeringType}
        setEngineeringType={setEngineeringType}
      />
      
      <div className="grid gap-2">
        <Label>Áreas de atuação em que atua ou gostaria de atuar</Label>
        <AreasOfExpertise 
          areasOfExpertise={areasOfExpertise} 
          updateAreasOfExpertise={updateAreasOfExpertise}
        />
      </div>

      <ProfileDescriptionGenerator
        engineeringType={engineeringType}
        areasOfExpertise={areasOfExpertise}
        professionalDescription={professionalDescription}
        setProfessionalDescription={setProfessionalDescription}
      />
    </>
  );
};
