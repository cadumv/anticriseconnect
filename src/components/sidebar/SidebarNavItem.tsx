
import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  badge?: number;
}

export function SidebarNavItem({ to, icon: Icon, label, collapsed, badge }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
          isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
        }`
      }
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {typeof badge === 'number' && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
