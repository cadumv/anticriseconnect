
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EducationInstitutionField } from "./EducationInstitutionField";
import { EducationDegreeField } from "./EducationDegreeField";
import { EducationFieldOfStudyField } from "./EducationFieldOfStudyField";
import { EducationDatesField } from "./EducationDatesField";
import { EducationDescriptionField } from "./EducationDescriptionField";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationItemProps {
  education: Education;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationItem = ({
  education,
  index,
  onRemove,
  onUpdate
}: EducationItemProps) => {
  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        <EducationInstitutionField 
          institution={education.institution}
          index={index}
          onUpdate={onUpdate}
        />

        <EducationDegreeField 
          degree={education.degree}
          index={index}
          onUpdate={onUpdate}
        />
      </div>

      <EducationFieldOfStudyField 
        fieldOfStudy={education.fieldOfStudy}
        index={index}
        onUpdate={onUpdate}
      />

      <EducationDatesField 
        startYear={education.startYear}
        endYear={education.endYear}
        index={index}
        onUpdate={onUpdate}
      />

      <EducationDescriptionField 
        description={education.description}
        index={index}
        onUpdate={onUpdate}
      />
    </div>
  );
};
