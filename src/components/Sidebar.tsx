
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import { Home, Search, MessageSquare, Bell, User, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user, signOut, projectName } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name?.substring(0, 1)?.toUpperCase() || "U";
  };

  const menuItems = [
    { path: "/", label: "Página inicial", icon: Home },
    { path: "/search", label: "Pesquisar", icon: Search },
    { path: "/messages", label: "Mensagens", icon: MessageSquare },
    { path: "/notifications", label: "Notificações", icon: Bell },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "h-screen border-r border-gray-200 bg-white transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="p-4 border-b border-gray-200">
        <h1 className={cn(
          "text-xl font-bold transition-opacity duration-300",
          collapsed ? "opacity-0 h-0" : "opacity-100"
        )}>
          {projectName}
        </h1>
        <button 
          onClick={toggleSidebar} 
          className={cn(
            "mt-2 text-blue-600 hover:text-blue-800",
            collapsed ? "mx-auto block" : ""
          )}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                  isActive && "font-medium text-blue-600 bg-blue-50 hover:bg-blue-100",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
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
              <AvatarImage src={user?.user_metadata?.avatar_url} />
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
    </div>
  );
}
