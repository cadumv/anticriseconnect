
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const { signIn, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    // Navigation will happen automatically through the auth state change
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsRecovery(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isRecovery ? "Recuperar senha" : "Login"}</CardTitle>
          <CardDescription>
            {isRecovery 
              ? "Enviaremos um link para redefinir sua senha" 
              : "Entre com suas credenciais abaixo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRecovery ? handleRecovery : handleLogin}>
            <div className="grid gap-4">
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
              
              {!isRecovery && (
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0" 
                      onClick={() => setIsRecovery(true)}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <Button type="submit" disabled={loading}>
                {loading 
                  ? "Processando..." 
                  : isRecovery 
                    ? "Enviar link de recuperação" 
                    : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {isRecovery ? (
            <Button 
              variant="link" 
              onClick={() => setIsRecovery(false)}
              className="mt-2"
            >
              Voltar para o login
            </Button>
          ) : (
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link 
                  to="/signup" 
                  className="text-primary hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
