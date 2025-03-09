
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Handshake, Users, UserPlus } from "lucide-react";
import { useState } from "react";

type ConnectionType = "connections" | "followers" | "following";

interface ConnectionsDialogProps {
  type: ConnectionType;
  count: number;
}

export const ConnectionsDialog = ({ type, count }: ConnectionsDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const getTitle = () => {
    switch (type) {
      case "connections": return "Conexões";
      case "followers": return "Seguidores";
      case "following": return "Seguindo";
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case "connections": return <Handshake className="h-4 w-4 text-blue-500" />;
      case "followers": return <Users className="h-4 w-4 text-blue-500" />;
      case "following": return <UserPlus className="h-4 w-4 text-blue-500" />;
    }
  };

  // Mock data - in a real app this would come from the database
  const users = [
    { id: 1, name: "Ana Silva", avatar: null, role: "Engenheira Civil" },
    { id: 2, name: "Carlos Mendes", avatar: null, role: "Engenheiro Mecânico" },
    { id: 3, name: "Júlia Santos", avatar: null, role: "Engenheira Elétrica" },
  ];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-1">
            {getIcon()}
            <span className="font-bold text-base">{count}</span>
          </div>
          <span className="text-gray-700 font-medium">{getTitle().toLowerCase()}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()} {getTitle()} ({count})
          </DialogTitle>
          <DialogDescription>
            {type === "connections" && "Pessoas que se conectaram com você para trocas anticrise."}
            {type === "followers" && "Pessoas que seguem seu perfil."}
            {type === "following" && "Perfis que você segue."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-md font-bold text-blue-500">
                    {user.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
