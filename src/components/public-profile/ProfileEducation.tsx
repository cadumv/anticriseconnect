
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationViewList } from "../profile/sections/education/EducationViewList";
import { Education } from "@/types/profile";

interface ProfileEducationProps {
  education: Education[];
}

export const ProfileEducation = ({ education }: ProfileEducationProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <EducationViewList educationList={education || []} />
      </CardContent>
    </Card>
  );
};
