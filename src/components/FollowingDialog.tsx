import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConnectionUserList } from "./connections/ConnectionUserList";
import { useConnectionUsers } from "@/hooks/useConnectionUsers";
import { useAuth } from "@/hooks/useAuth";
interface FollowingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // Add userId prop to show following for other profiles
}
export const FollowingDialog = ({
  isOpen,
  onClose,
  userId
}: FollowingDialogProps) => {
  const {
    user
  } = useAuth();
  const targetUserId = userId || user?.id;
  const {
    users,
    loading
  } = useConnectionUsers({
    userId: targetUserId,
    type: "following",
    dialogOpen: isOpen
  });
  const followingCount = users.length;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="text-blue-500">★</span> Seguindo ({followingCount})
          </DialogTitle>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            
          </button>
        </DialogHeader>
        
        <div className="text-sm text-gray-600 mb-4">
          {userId && userId !== user?.id ? "Perfis que este usuário segue." : "Perfis que você segue."}
        </div>
        
        <ConnectionUserList users={users} loading={loading} type="following" />
      </DialogContent>
    </Dialog>;
};