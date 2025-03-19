
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  activeColor?: string;
}

export function ActionButton({
  onClick,
  icon: Icon,
  label,
  isActive = false,
  activeColor = ""
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className="flex-1 rounded-md hover:bg-gray-100 py-2 h-9"
    >
      <div className="flex items-center justify-center gap-2 w-full text-gray-600">
        <Icon
          size={18}
          fill={isActive ? "currentColor" : "none"}
          className={isActive ? activeColor : "text-gray-500"}
        />
        <span className={`text-sm font-medium ${isActive ? activeColor : ""}`}>{label}</span>
      </div>
    </Button>
  );
}
