
import { User } from "@supabase/supabase-js";

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface ProfileEducationProps {
  user: User;
}
