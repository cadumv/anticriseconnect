
import React from "react";
import { ExperienceViewItem } from "./ExperienceViewItem";
import { Experience } from "./types";

interface ExperienceViewListProps {
  experienceList: Experience[];
}

export const ExperienceViewList: React.FC<ExperienceViewListProps> = ({ experienceList }) => {
  if (!experienceList || experienceList.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhuma experiência profissional adicionada
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {experienceList.map((exp, index) => (
        <ExperienceViewItem key={index} experience={exp} />
      ))}
    </div>
  );
};
