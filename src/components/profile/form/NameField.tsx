
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface NameFieldProps {
  name: string;
  setName: (name: string) => void;
}

export const NameField = ({ name, setName }: NameFieldProps) => {
  return (
    <FormField id="name" label="Nome do Perfil">
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
      />
    </FormField>
  );
};
