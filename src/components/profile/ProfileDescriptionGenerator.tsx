
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfileDescription } from "@/hooks/useProfileDescription";
import { ProfileDescriptionButton } from "./ProfileDescriptionButton";
import { CharacterCounter } from "./CharacterCounter";

interface ProfileDescriptionGeneratorProps {
  engineeringType: string;
  areasOfExpertise: string[];
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
}

export const ProfileDescriptionGenerator = ({
  engineeringType,
  areasOfExpertise,
  professionalDescription,
  setProfessionalDescription
}: ProfileDescriptionGeneratorProps) => {
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limit to 250 characters
    if (value.length <= 250) {
      setProfessionalDescription(value);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="professional-description">Breve descrição sobre sua atuação profissional</Label>
        <div className="flex gap-2">
          <ProfileDescriptionButton
            type="improve"
            onClick={improveProfessionalDescription}
            isLoading={isImprovingDescription}
            disabled={!engineeringType || !professionalDescription.trim()}
          />

          <ProfileDescriptionButton
            type="generate"
            onClick={generateProfessionalDescription}
            isLoading={isGeneratingDescription}
            disabled={!engineeringType}
          />
        </div>
      </div>
      <Textarea
        id="professional-description"
        value={professionalDescription}
        onChange={handleTextChange}
        placeholder="Descreva brevemente sua experiência e atuação profissional (máximo 250 caracteres)"
        rows={3}
        maxLength={250}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {!engineeringType && "Selecione um tipo de engenharia para usar a assistência de IA"}
        </p>
        <CharacterCounter current={professionalDescription.length} max={250} />
      </div>
    </div>
  );
};
