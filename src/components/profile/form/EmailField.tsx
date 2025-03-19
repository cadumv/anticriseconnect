
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { User } from "@supabase/supabase-js";

interface EmailFieldProps {
  user: User;
}

export const EmailField = ({ user }: EmailFieldProps) => {
  return (
    <FormField 
      id="email" 
      label="Email" 
      helperText="O email não pode ser alterado"
      disabled
    >
      <Input id="email" type="email" value={user.email} disabled />
    </FormField>
  );
};
