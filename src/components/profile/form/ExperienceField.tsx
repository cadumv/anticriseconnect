
import { Card, CardContent } from "@/components/ui/card";
import { ExperienceList } from "./experience/ExperienceList";

interface Experience {
  company: string;
  position: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

interface ExperienceFieldProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}

export const ExperienceField = ({ 
  experiences = [], 
  setExperiences 
}: ExperienceFieldProps) => {
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        description: ""
      }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    
    // If marking as current position, clear end dates
    if (field === 'current' && value === true) {
      newExperiences[index].endMonth = '';
      newExperiences[index].endYear = '';
    }
    
    setExperiences(newExperiences);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <ExperienceList
            experiences={experiences}
            updateExperience={updateExperience}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
          />
        </div>
      </CardContent>
    </Card>
  );
};
