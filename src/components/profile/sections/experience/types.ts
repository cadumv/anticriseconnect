
import { User } from "@supabase/supabase-js";

export interface Experience {
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

export interface ProfileExperienceProps {
  user: User;
}
