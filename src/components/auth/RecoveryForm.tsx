
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface RecoveryFormProps {
  email: string;
  setEmail: (email: string) => void;
  handleRecovery: (e: React.FormEvent) => Promise<void>;
  setIsRecovery: (isRecovery: boolean) => void;
  loading: boolean;
}

export const RecoveryForm = ({
  email,
  setEmail,
  handleRecovery,
  setIsRecovery,
  loading
}: RecoveryFormProps) => {
  return (
    <form onSubmit={handleRecovery} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-gray-600">
          Email
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={18} />
          </span>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="border border-gray-300 rounded pl-10"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Processando..." : "Enviar link"}
      </Button>

      <Button 
        variant="link" 
        onClick={() => setIsRecovery(false)}
        className="w-full p-0 mt-2 text-blue-600"
      >
        Voltar para o login
      </Button>
    </form>
  );
};
