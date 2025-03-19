
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileNavbarProps {
  onOpenChat: () => void;
}

export const ProfileNavbar = ({ onOpenChat }: ProfileNavbarProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden md:flex"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden md:flex"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpenChat}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Mensagens</span>
        </Button>
      </div>
    </div>
  );
};
