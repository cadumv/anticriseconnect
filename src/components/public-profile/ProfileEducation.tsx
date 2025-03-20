
// This file is kept for reference but its functionality has been integrated directly into PublicProfile.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationViewList } from "../profile/sections/education/EducationViewList";
import { Education } from "@/types/profile";

interface ProfileEducationProps {
  education: Education[];
}

export const ProfileEducation = ({ education }: ProfileEducationProps) => {
  // This component is no longer used
  return null;
};
