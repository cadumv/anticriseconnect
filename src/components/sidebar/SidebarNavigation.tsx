
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, MessageSquare, Bell, User, Trophy, Bookmark } from "lucide-react";

interface SidebarNavigationProps {
  collapsed: boolean;
  savedPostsCount: number;
  onOpenSavedPosts: () => void;
}

export function SidebarNavigation({ 
  collapsed, 
  savedPostsCount, 
  onOpenSavedPosts 
}: SidebarNavigationProps) {
  const menuItems = [
    { path: "/", label: "Página inicial", icon: Home },
    { path: "/profile", label: "Perfil", icon: User },
    { path: "/search", label: "Pesquisar", icon: Search },
    { path: "/messages", label: "Mensagens", icon: MessageSquare },
    { path: "/notifications", label: "Notificações", icon: Bell },
    { path: "/achievements", label: "Conquistas", icon: Trophy },
  ];

  return (
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
        
        {/* Saved Posts Button */}
        <li>
          <button 
            onClick={onOpenSavedPosts}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <Bookmark className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
            {!collapsed && (
              <span>Publicações salvas {savedPostsCount > 0 && `(${savedPostsCount})`}</span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}
