
import { Card, CardContent } from "@/components/ui/card";
import { EducationList } from "./education/EducationList";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationFieldProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

export const EducationField = ({ 
  education = [], 
  setEducation 
}: EducationFieldProps) => {
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        description: ""
      }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducation(newEducation);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <EducationList
            education={education}
            updateEducation={updateEducation}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
          />
        </div>
      </CardContent>
    </Card>
  );
};
