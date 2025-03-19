
import { ProfileDescriptionButton } from "../../ProfileDescriptionButton";

interface DescriptionActionsProps {
  onGenerate: () => void;
  onImprove: () => void;
  isGenerating: boolean;
  isImproving: boolean;
  hasEngType: boolean;
  hasDescription: boolean;
}

export const DescriptionActions = ({
  onGenerate,
  onImprove,
  isGenerating,
  isImproving,
  hasEngType,
  hasDescription
}: DescriptionActionsProps) => {
  return (
    <div className="flex gap-2">
      <ProfileDescriptionButton
        type="improve"
        onClick={onImprove}
        isLoading={isImproving}
        disabled={!hasEngType || !hasDescription}
      />

      <ProfileDescriptionButton
        type="generate"
        onClick={onGenerate}
        isLoading={isGenerating}
        disabled={!hasEngType}
      />
    </div>
  );
};
