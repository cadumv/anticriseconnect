
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecoveryFormProps {
  email: string;
  setEmail: (email: string) => void;
  handleRecovery: (e: React.FormEvent) => Promise<void>;
  setIsRecovery: (isRecovery: boolean) => void;
  loading: boolean;
  error?: string;
}

export const RecoveryForm = ({
  email,
  setEmail,
  handleRecovery,
  setIsRecovery,
  loading,
  error
}: RecoveryFormProps) => {
  return (
    <form onSubmit={handleRecovery} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
