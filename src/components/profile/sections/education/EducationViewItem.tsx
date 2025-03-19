
import React from "react";
import { Education } from "./types";

interface EducationViewItemProps {
  education: Education;
}

export const EducationViewItem: React.FC<EducationViewItemProps> = ({ education }) => {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
        <span className="text-amber-600 font-semibold text-sm">
          {education.institution ? education.institution.substring(0, 3).toUpperCase() : "EDU"}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-sm">{education.institution || "Instituição não informada"}</h3>
        <p className="text-sm text-gray-700">
          {education.degree && education.fieldOfStudy ? `${education.degree} em ${education.fieldOfStudy}` : 
          education.degree ? education.degree : 
          education.fieldOfStudy ? education.fieldOfStudy : "Curso não informado"}
        </p>
        <p className="text-xs text-gray-500">
          {education.startYear && education.endYear ? 
            `${education.startYear} - ${education.endYear === "Atual" ? "Atual" : education.endYear}` : 
            "Período não informado"}
        </p>
        {education.description && <p className="text-xs text-gray-600 mt-1">{education.description}</p>}
      </div>
    </div>
  );
};
