
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceViewList } from "../profile/sections/experience/ExperienceViewList";
import { Experience } from "@/types/profile";

interface ProfileExperienceProps {
  experience: Experience[];
}

export const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Experiência profissional</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <ExperienceViewList experienceList={experience || []} />
      </CardContent>
    </Card>
  );
};
