
import { User } from "@supabase/supabase-js";
import { EmailField } from "./form/EmailField";
import { NameField } from "./form/NameField";
import { UsernameField } from "./form/UsernameField";
import { PhoneField } from "./form/PhoneField";

interface PersonalInfoFieldsProps {
  user: User;
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  usernameError: string;
  phone: string;
  setPhone: (phone: string) => void;
}

export const PersonalInfoFields = ({
  user,
  name,
  setName,
  username,
  setUsername,
  usernameError,
  phone,
  setPhone,
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <EmailField user={user} />
      <NameField name={name} setName={setName} />
      <UsernameField 
        username={username} 
        setUsername={setUsername} 
        usernameError={usernameError} 
      />
      <PhoneField phone={phone} setPhone={setPhone} />
    </>
  );
};
