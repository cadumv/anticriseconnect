
import { EducationViewList } from "../profile/sections/education/EducationViewList";
import { Education } from "../profile/sections/education/types";

interface ProfileEducationProps {
  education: Education[];
}

export const ProfileEducation = ({ education }: ProfileEducationProps) => {
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-base font-semibold mb-4">Formação Acadêmica</h3>
      <EducationViewList educationList={education || []} />
    </div>
  );
};
