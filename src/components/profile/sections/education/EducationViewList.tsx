
import React from "react";
import { EducationViewItem } from "./EducationViewItem";
import { Education } from "./types";

interface EducationViewListProps {
  educationList: Education[];
}

export const EducationViewList: React.FC<EducationViewListProps> = ({ educationList }) => {
  if (!educationList || educationList.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhuma formação acadêmica adicionada
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {educationList.map((edu, index) => (
        <EducationViewItem key={index} education={edu} />
      ))}
    </div>
  );
};
