
import { AreasOfExpertiseField } from "./form/AreasOfExpertiseField";
import { EngineeringTypeField } from "./form/EngineeringTypeField";
import { ProfessionalDescriptionField } from "./form/ProfessionalDescriptionField";

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
      <EngineeringTypeField 
        engineeringType={engineeringType}
        setEngineeringType={setEngineeringType}
      />
      
      <AreasOfExpertiseField 
        areasOfExpertise={areasOfExpertise} 
        updateAreasOfExpertise={updateAreasOfExpertise}
      />

      <ProfessionalDescriptionField
        engineeringType={engineeringType}
        areasOfExpertise={areasOfExpertise}
        professionalDescription={professionalDescription}
        setProfessionalDescription={setProfessionalDescription}
      />
    </>
  );
};
