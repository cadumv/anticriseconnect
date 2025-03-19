
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { useSidebarState } from "@/hooks/useSidebarState";

export function Sidebar() {
  const { user, signOut, projectName } = useAuth();
  const { collapsed, toggleSidebar } = useSidebarState();
  
  if (!user) return null;

  return (
    <div className={cn(
      "h-screen border-r border-gray-200 bg-white transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <SidebarHeader 
        projectName={projectName} 
        collapsed={collapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <SidebarNavigation 
        collapsed={collapsed}
      />
      
      <SidebarUserProfile 
        user={user} 
        collapsed={collapsed} 
        signOut={signOut} 
      />
    </div>
  );
}
