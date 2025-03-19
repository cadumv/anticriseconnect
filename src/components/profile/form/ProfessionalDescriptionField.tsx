
import { ProfileDescriptionGenerator } from "../ProfileDescriptionGenerator";

interface ProfessionalDescriptionFieldProps {
  engineeringType: string;
  areasOfExpertise: string[];
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
}

export const ProfessionalDescriptionField = ({
  engineeringType,
  areasOfExpertise,
  professionalDescription,
  setProfessionalDescription
}: ProfessionalDescriptionFieldProps) => {
  return (
    <ProfileDescriptionGenerator
      engineeringType={engineeringType}
      areasOfExpertise={areasOfExpertise}
      professionalDescription={professionalDescription}
      setProfessionalDescription={setProfessionalDescription}
    />
  );
};
