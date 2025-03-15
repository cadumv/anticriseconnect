
import { useState } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return {
    collapsed,
    toggleSidebar
  };
}
