
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConnectionType, ConnectionTypeIcon, getConnectionTypeTitle, getConnectionTypeDescription } from "./connections/ConnectionTypeIcon";
import { ConnectionUserList } from "./connections/ConnectionUserList";
import { useConnectionUsers } from "@/hooks/useConnectionUsers";

interface ConnectionsDialogProps {
  type: ConnectionType;
  count: number;
  trigger?: React.ReactNode;
}

export const ConnectionsDialog = ({ type, count, trigger }: ConnectionsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { users, loading } = useConnectionUsers({ 
    userId: user?.id, 
    type, 
    dialogOpen: open 
  });
  
  const title = getConnectionTypeTitle(type);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-1">
              <ConnectionTypeIcon type={type} />
              <span className="font-bold text-base">{users.length > 0 ? users.length : count}</span>
            </div>
            <span className="text-gray-700 font-medium">{title.toLowerCase()}</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ConnectionTypeIcon type={type} /> {title} ({users.length > 0 ? users.length : count})
          </DialogTitle>
          <DialogDescription>
            {getConnectionTypeDescription(type)}
          </DialogDescription>
        </DialogHeader>
        
        <ConnectionUserList
          users={users}
          loading={loading}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
};
