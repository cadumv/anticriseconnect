
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarLogoutButtonProps {
  collapsed: boolean;
}

export function SidebarLogoutButton({ collapsed }: SidebarLogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        collapsed ? "justify-center" : "justify-start"
      )}
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5 mr-3" />
      {!collapsed && <span>Sair</span>}
    </Button>
  );
}
