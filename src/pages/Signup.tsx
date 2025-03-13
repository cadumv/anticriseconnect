
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [referrerId, setReferrerId] = useState("");
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract referrer id from URL if present
    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get('ref');
    if (ref) {
      setReferrerId(ref);
      console.log("User referred by:", ref);
    }
  }, [location]);

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
      
      // If we have a referrer ID, update their referral count
      if (referrerId) {
        // Update referrer's referral count in localStorage for now
        // In a real app, this would be stored in the database
        const referralsKey = `user_referrals_${referrerId}`;
        const existingReferrals = localStorage.getItem(referralsKey);
        const referrals = existingReferrals ? JSON.parse(existingReferrals) : [];
        
        // Add this user as a referral
        const newReferral = {
          id: Date.now().toString(),
          email: email,
          date: new Date().toISOString()
        };
        
        referrals.push(newReferral);
        localStorage.setItem(referralsKey, JSON.stringify(referrals));
        
        // Update the referrer's mission progress
        const missionsKey = `user_missions_${referrerId}`;
        const savedMissions = localStorage.getItem(missionsKey);
        
        if (savedMissions) {
          const parsedMissions = JSON.parse(savedMissions);
          const updatedMissions = parsedMissions.map((mission: any) => {
            if (mission.id === "mission-invite") {
              return {
                ...mission,
                currentProgress: Math.min(referrals.length, mission.requiredProgress)
              };
            }
            return mission;
          });
          
          localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para conectar-se com outros engenheiros
          </CardDescription>
          {referrerId && (
            <div className="mt-2 text-sm text-blue-600">
              Você foi convidado por um colega engenheiro
            </div>
          )}
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
