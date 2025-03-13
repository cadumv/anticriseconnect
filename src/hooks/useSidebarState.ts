
import { useState } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return {
    collapsed,
    showSavedDrawer,
    setShowSavedDrawer,
    toggleSidebar
  };
}
