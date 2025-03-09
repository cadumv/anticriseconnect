
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lightbulb, Loader2, Wand2 } from "lucide-react";

interface ProfileDescriptionButtonProps {
  type: "generate" | "improve";
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ProfileDescriptionButton = ({
  type,
  onClick,
  isLoading,
  disabled
}: ProfileDescriptionButtonProps) => {
  const icon = type === "generate" ? <Lightbulb className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />;
  const text = type === "generate" ? "Gerar" : "Melhorar";
  const tooltipText = type === "generate" 
    ? "Gerar nova descrição com IA baseada no seu tipo de engenharia e áreas de atuação" 
    : "Melhorar a descrição atual com IA";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onClick}
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              icon
            )}
            <span className="ml-1">{text}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
