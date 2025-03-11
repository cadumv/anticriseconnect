
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  setIsRecovery: (isRecovery: boolean) => void;
  loading: boolean;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleGoogleSignIn,
  setIsRecovery,
  loading
}: LoginFormProps) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-gray-600">
          Nome de Utilizador
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
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm text-gray-600">Palavra-passe</Label>
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-blue-600 font-normal text-xs"
            onClick={() => setIsRecovery(true)}
          >
            Esqueceu a senha?
          </Button>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Key size={18} />
          </span>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Processando..." : "INICIAR SESSÃO"}
      </Button>
      
      <div className="relative flex items-center justify-center mt-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="mx-4 text-sm text-gray-500">ou</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full border border-gray-300"
        onClick={handleGoogleSignIn}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Entrar com Google
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  );
};
