
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProfileDescription } from "@/hooks/useProfileDescription";
import { DescriptionTextarea } from "./description/DescriptionTextarea";
import { DescriptionActions } from "./description/DescriptionActions";
import { DescriptionHelperText } from "./description/DescriptionHelperText";

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
  const {
    isGeneratingDescription,
    isImprovingDescription,
    generateProfessionalDescription,
    improveProfessionalDescription
  } = useProfileDescription({
    engineeringType,
    areasOfExpertise,
    professionalDescription,
    setProfessionalDescription
  });

  const hasEngType = Boolean(engineeringType);
  const hasDescription = Boolean(professionalDescription.trim());

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Descrição Profissional</h3>
            <DescriptionActions 
              onGenerate={generateProfessionalDescription}
              onImprove={improveProfessionalDescription}
              isGenerating={isGeneratingDescription}
              isImproving={isImprovingDescription}
              hasEngType={hasEngType}
              hasDescription={hasDescription}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="professional-description">Breve descrição sobre sua atuação profissional</Label>
            <DescriptionTextarea 
              description={professionalDescription}
              onChange={setProfessionalDescription}
              maxLength={250}
              placeholder="Descreva brevemente sua experiência e atuação profissional"
              rows={3}
            />
          </div>
          
          <DescriptionHelperText hasEngType={hasEngType} />
        </div>
      </CardContent>
    </Card>
  );
};
