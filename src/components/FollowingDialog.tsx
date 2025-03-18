
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConnectionUserList } from "./connections/ConnectionUserList";
import { useConnectionUsers } from "@/hooks/useConnectionUsers";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface FollowingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FollowingDialog = ({ isOpen, onClose }: FollowingDialogProps) => {
  const { user } = useAuth();
  const { users, loading } = useConnectionUsers({ 
    userId: user?.id, 
    type: "following", 
    dialogOpen: isOpen 
  });
  
  const followingCount = users.length;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="text-blue-500">★</span> Seguindo ({followingCount})
          </DialogTitle>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="text-sm text-gray-600 mb-4">
          Perfis que você segue.
        </div>
        
        <ConnectionUserList
          users={users}
          loading={loading}
          type="following"
        />
      </DialogContent>
    </Dialog>
  );
};
