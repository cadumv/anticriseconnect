
// This file is kept for reference but its functionality has been integrated directly into PublicProfile.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceViewList } from "../profile/sections/experience/ExperienceViewList";
import { Experience } from "@/types/profile";

interface ProfileExperienceProps {
  experience: Experience[];
}

export const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  // This component is no longer used
  return null;
};
