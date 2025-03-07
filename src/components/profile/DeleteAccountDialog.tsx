
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface DeleteAccountDialogProps {
  deleteAccount: () => Promise<void>;
}

export const DeleteAccountDialog = ({ deleteAccount }: DeleteAccountDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir conta</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os seus dados.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteAccount();
              setDeleteDialogOpen(false);
            }}
          >
            Confirmar exclusão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
