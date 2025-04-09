
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  BookOpen,
  Briefcase,
  Users,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SidebarNavigationProps {
  collapsed?: boolean;
}

export const SidebarNavigation = ({ collapsed = false }: SidebarNavigationProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      // Check for unread notifications
      const checkUnreadNotifications = () => {
        const notificationKey = `notifications_${user.id}`;
        const storedNotifications = localStorage.getItem(notificationKey);
        
        if (storedNotifications) {
          try {
            const parsedNotifications = JSON.parse(storedNotifications);
            const unreadNotifications = parsedNotifications.filter((n: any) => !n.read);
            setUnreadCount(unreadNotifications.length);
          } catch (error) {
            console.error("Error parsing notifications:", error);
          }
        }
      };
      
      checkUnreadNotifications();
      
      // Check for new notifications every 30 seconds
      const interval = setInterval(checkUnreadNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

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
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Home className="h-5 w-5" />
          {!collapsed && <span>Início</span>}
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Search className="h-5 w-5" />
          {!collapsed && <span>Buscar</span>}
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {!collapsed && <span>Notificações</span>}
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <MessageSquare className="h-5 w-5" />
          {!collapsed && <span>Mensagens</span>}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <User className="h-5 w-5" />
          {!collapsed && <span>Perfil</span>}
        </NavLink>
        <NavLink
          to="/publications"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <BookOpen className="h-5 w-5" />
          {!collapsed && <span>Publicações</span>}
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Briefcase className="h-5 w-5" />
          {!collapsed && <span>Vagas</span>}
        </NavLink>
        <NavLink
          to="/connections"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Users className="h-5 w-5" />
          {!collapsed && <span>Conexões</span>}
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Newspaper className="h-5 w-5" />
          {!collapsed && <span>Notícias</span>}
        </NavLink>
      </div>
      <div className="space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
            }`
          }
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
};
