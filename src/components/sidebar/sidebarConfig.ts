
import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  Settings
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavItems: NavItem[] = [
  { path: "/", label: "Início", icon: Home },
  { path: "/search", label: "Buscar", icon: Search },
  { path: "/notifications", label: "Notificações", icon: Bell },
  { path: "/messages", label: "Mensagens", icon: MessageSquare },
  { path: "/profile", label: "Perfil", icon: User }
];

export const bottomNavItems: NavItem[] = [
  { path: "/settings", label: "Configurações", icon: Settings }
];
