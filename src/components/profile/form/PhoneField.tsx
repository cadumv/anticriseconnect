
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface PhoneFieldProps {
  phone: string;
  setPhone: (phone: string) => void;
}

export const PhoneField = ({ phone, setPhone }: PhoneFieldProps) => {
  return (
    <FormField id="phone" label="Telefone">
      <Input
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(xx) xxxxx-xxxx"
      />
    </FormField>
  );
};
