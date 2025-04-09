
import { useAuth } from "@/hooks/useAuth";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarLogoutButton } from "./SidebarLogoutButton";
import { mainNavItems, bottomNavItems } from "./sidebarConfig";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

interface SidebarNavigationProps {
  collapsed?: boolean;
}

export const SidebarNavigation = ({ collapsed = false }: SidebarNavigationProps) => {
  const { user } = useAuth();
  const unreadCount = useUnreadNotifications(user);
  
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        {mainNavItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            badge={item.path === "/notifications" ? unreadCount : undefined}
          />
        ))}
      </div>
      <div className="space-y-1">
        {bottomNavItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
        <SidebarLogoutButton collapsed={collapsed} />
      </div>
    </div>
  );
};
