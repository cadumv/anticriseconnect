
import React, { ReactNode } from "react";

interface SectionContainerProps {
  title: string;
  children: ReactNode;
}

export const SectionContainer = ({ title, children }: SectionContainerProps) => {
  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
};
