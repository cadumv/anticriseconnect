
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UsernameFieldProps {
  username: string;
  setUsername: (username: string) => void;
  usernameError: string;
}

export const UsernameField = ({ 
  username, 
  setUsername, 
  usernameError 
}: UsernameFieldProps) => {
  return (
    <FormField 
      id="username" 
      label="Nome de usuário"
      helperText="Use letras minúsculas, números, pontos e underscores. Entre 3 e 20 caracteres. Deve começar com uma letra."
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500">@</span>
        </div>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="seu_nome_de_usuario"
          className="pl-8"
        />
      </div>
      {usernameError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{usernameError}</AlertDescription>
        </Alert>
      )}
    </FormField>
  );
};
