
import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  loading: boolean;
  isFormValid: boolean;
  onCancel: () => void;
}

export const ProfileFormActions = ({ loading, isFormValid, onCancel }: ProfileFormActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={loading || !isFormValid}>
        {loading ? "Salvando..." : "Salvar alterações"}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  );
};
