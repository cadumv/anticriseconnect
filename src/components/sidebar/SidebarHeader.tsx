
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  projectName: string;
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function SidebarHeader({ projectName, collapsed, toggleSidebar }: SidebarHeaderProps) {
  return (
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
  );
}
