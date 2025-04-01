
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarUserProfileProps {
  user: User | null;
  collapsed: boolean;
  signOut: () => void;
}

export function SidebarUserProfile({ user, collapsed, signOut }: SidebarUserProfileProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name?.substring(0, 1)?.toUpperCase() || "U";
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className={cn(
        "flex items-center gap-3",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn(
          "flex items-center gap-2", 
          collapsed ? "hidden" : "flex"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} style={{ objectFit: "contain" }} />
            <AvatarFallback>{getInitials(user?.user_metadata?.name || "")}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate max-w-[120px]">
            {user?.user_metadata?.name || "Usuário"}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={signOut} 
          className="text-gray-500 hover:text-red-600"
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
