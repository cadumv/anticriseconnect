
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const { signIn, signInWithGoogle, resetPassword, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to profile page if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting to profile", user);
      navigate('/profile');
    }
  }, [user, navigate]);

  // Check for error parameters in URL (common with OAuth redirects)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');
    
    if (error) {
      console.error("OAuth Error:", error, errorDescription);
      // Could add toast notification here
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    // Redirection will happen automatically through the useEffect hook above
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsRecovery(false);
  };

  const handleGoogleSignIn = async () => {
    console.log("Initiating Google sign in");
    await signInWithGoogle();
    // Redirection will happen automatically through the useEffect hook above
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Bem-vindo(a) ao Conecta Engenharia</h1>
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
          
          {!isRecovery && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrar com Google
              </Button>
            </>
          )}
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
