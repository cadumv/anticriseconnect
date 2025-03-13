
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { SavedPostsDrawer } from "./feed/SavedPostsDrawer";
import { useSidebarState } from "@/hooks/useSidebarState";

export function Sidebar() {
  const { user, signOut, projectName } = useAuth();
  const { collapsed, showSavedDrawer, setShowSavedDrawer, toggleSidebar } = useSidebarState();
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (user) {
      const savedKey = `user_saved_posts_${user.id}`;
      const storedSaved = localStorage.getItem(savedKey);
      
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    }
  }, [user]);
  
  if (!user) return null;
  
  // Calculate saved posts count
  const savedPostsCount = Object.values(saved).filter(Boolean).length;

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
        savedPostsCount={savedPostsCount} 
        onOpenSavedPosts={() => setShowSavedDrawer(true)} 
      />
      
      <SidebarUserProfile 
        user={user} 
        collapsed={collapsed} 
        signOut={signOut} 
      />
      
      {/* Saved Posts Drawer */}
      <SavedPostsDrawer
        open={showSavedDrawer}
        onOpenChange={setShowSavedDrawer}
        user={user}
      />
    </div>
  );
}
