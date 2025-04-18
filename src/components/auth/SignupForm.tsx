
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { trackReferralSignup } from "@/utils/referralUtils";

interface SignupFormProps {
  referrerId: string;
}

export const SignupForm = ({ referrerId }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signUp, loading } = useAuth();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    
    try {
      await signUp(email, password, {
        name,
        phone: phone || undefined,
        referrerId: referrerId || undefined
      });
      
      // Track the referral after successful signup
      if (referrerId) {
        trackReferralSignup(referrerId, email);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(xx) xxxxx-xxxx"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (confirmPassword) validatePasswords();
            }}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (password) validatePasswords();
            }}
            required
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? "Processando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};
