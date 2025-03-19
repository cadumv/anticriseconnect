
import React from "react";
import { Experience } from "./types";

interface ExperienceViewItemProps {
  experience: Experience;
}

export const ExperienceViewItem: React.FC<ExperienceViewItemProps> = ({ experience }) => {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
        <span className="text-blue-600 font-semibold text-sm">
          {experience.company ? experience.company.substring(0, 3).toUpperCase() : "EXP"}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-sm">{experience.position || "Cargo não informado"}</h3>
        <p className="text-sm text-gray-700">{experience.company || "Empresa não informada"}</p>
        <p className="text-xs text-gray-500">
          {experience.startMonth && experience.startYear ? 
            `${experience.startMonth}/${experience.startYear} - ${experience.current ? 'Atual' : 
            (experience.endMonth && experience.endYear ? `${experience.endMonth}/${experience.endYear}` : 'Fim não informado')}` : 
            "Período não informado"}
        </p>
        {experience.location && <p className="text-xs text-gray-600">{experience.location}</p>}
        {experience.description && <p className="text-xs text-gray-600 mt-1">{experience.description}</p>}
      </div>
    </div>
  );
};
