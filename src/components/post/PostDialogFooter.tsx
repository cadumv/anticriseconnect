
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

interface PostDialogFooterProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}

export function PostDialogFooter({
  isSubmitting,
  isDisabled,
  onSubmit
}: PostDialogFooterProps) {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        onClick={onSubmit} 
        disabled={isSubmitting || isDisabled}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publicando...
          </>
        ) : (
          "Publicar"
        )}
      </Button>
    </DialogFooter>
  );
}
