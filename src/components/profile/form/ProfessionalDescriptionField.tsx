
import { ProfileDescriptionGenerator } from "../ProfileDescriptionGenerator";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <h3 className="text-lg font-medium">Descrição Profissional</h3>
          <ProfileDescriptionGenerator
            engineeringType={engineeringType}
            areasOfExpertise={areasOfExpertise}
            professionalDescription={professionalDescription}
            setProfessionalDescription={setProfessionalDescription}
          />
        </div>
      </CardContent>
    </Card>
  );
};
