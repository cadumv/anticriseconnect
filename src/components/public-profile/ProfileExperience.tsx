
import { ExperienceViewList } from "../profile/sections/experience/ExperienceViewList";
import { Experience } from "../profile/sections/experience/types";

interface ProfileExperienceProps {
  experience: Experience[];
}

export const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-base font-semibold mb-4">Experiência Profissional</h3>
      <ExperienceViewList experienceList={experience || []} />
    </div>
  );
};
