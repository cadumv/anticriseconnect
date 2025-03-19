
import { AreasOfExpertiseField } from "./form/AreasOfExpertiseField";
import { EngineeringTypeField } from "./form/EngineeringTypeField";
import { ProfessionalDescriptionField } from "./form/ProfessionalDescriptionField";
import { EducationField } from "./form/EducationField";
import { ExperienceField } from "./form/ExperienceField";
import { InterestsField } from "./form/InterestsField";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

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

interface ProfessionalInfoFieldsProps {
  engineeringType: string;
  setEngineeringType: (engineeringType: string) => void;
  areasOfExpertise: string[];
  updateAreasOfExpertise: (index: number, value: string) => void;
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
  education: Education[];
  setEducation: (education: Education[]) => void;
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
}

export const ProfessionalInfoFields = ({
  engineeringType,
  setEngineeringType,
  areasOfExpertise,
  updateAreasOfExpertise,
  professionalDescription,
  setProfessionalDescription,
  education,
  setEducation,
  experiences,
  setExperiences,
  interests,
  setInterests
}: ProfessionalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <ProfessionalDescriptionField
        engineeringType={engineeringType}
        areasOfExpertise={areasOfExpertise}
        professionalDescription={professionalDescription}
        setProfessionalDescription={setProfessionalDescription}
      />
      
      <EngineeringTypeField 
        engineeringType={engineeringType}
        setEngineeringType={setEngineeringType}
      />
      
      <ExperienceField 
        experiences={experiences}
        setExperiences={setExperiences}
      />
      
      <EducationField 
        education={education}
        setEducation={setEducation}
      />
      
      <AreasOfExpertiseField 
        areasOfExpertise={areasOfExpertise} 
        updateAreasOfExpertise={updateAreasOfExpertise}
      />
      
      <InterestsField 
        interests={interests}
        setInterests={setInterests}
      />
    </div>
  );
};
