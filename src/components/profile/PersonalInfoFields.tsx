
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@supabase/supabase-js";

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
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email} disabled />
        <p className="text-sm text-muted-foreground">O email não pode ser alterado</p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nome do Perfil</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="username">Nome de usuário</Label>
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
        <p className="text-xs text-muted-foreground">
          Use letras minúsculas, números, pontos e underscores. Entre 3 e 20 caracteres. Deve começar com uma letra.
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(xx) xxxxx-xxxx"
        />
      </div>
    </>
  );
};
