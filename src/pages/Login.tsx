
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LogIn, Users, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryComplete, setRecoveryComplete] = useState(false);
  const { signIn, signInWithGoogle, resetPassword, loading, user, projectName } = useAuth();
  const navigate = useNavigate();

  // Redirect to home page if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting to home", user);
      navigate('/');
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
    console.log("Attempting login with:", email);
    const success = await signIn(email, password);
    console.log("Login result:", success);
    // Redirection will happen automatically through the useEffect hook above
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting password recovery for:", email);
    await resetPassword(email);
    setRecoveryComplete(true);
  };

  const handleCloseRecoveryDialog = () => {
    setRecoveryComplete(false);
    setIsRecovery(false);
  };

  const handleGoogleSignIn = async () => {
    console.log("Initiating Google sign in");
    await signInWithGoogle();
    // Redirection will happen automatically through the useEffect hook above
  };

  console.log("Rendering Login component, isRecovery:", isRecovery);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Left side with image and branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary/5 flex-col items-center justify-center p-10">
        <div className="flex flex-col items-center max-w-md">
          <img 
            src="/lovable-uploads/engineering-network.png" 
            alt="Engenheiros conectados" 
            className="w-full max-w-md mb-8 rounded-lg shadow-lg"
          />
          <h1 className="text-3xl font-bold text-primary mb-4 text-center">
            Anticrise Connect
          </h1>
          <p className="text-center text-slate-600 mb-6">
            A plataforma de networking que conecta engenheiros com as melhores oportunidades.
            Compartilhe conhecimento, encontre parceiros e impulsione sua carreira.
          </p>
          <div className="flex items-center space-x-2 text-primary">
            <Users className="h-5 w-5" />
            <span className="font-medium">Conecte-se com outros profissionais da engenharia</span>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
        <div className="md:hidden text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Anticrise Connect
          </h1>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            Conectando engenheiros, construindo oportunidades
          </p>
        </div>

        <Card className="w-full max-w-[400px] shadow-md">
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

      {/* Recovery email confirmation dialog */}
      <Dialog open={recoveryComplete} onOpenChange={setRecoveryComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email enviado</DialogTitle>
            <DialogDescription>
              Um link para redefinição de senha foi enviado para seu email. 
              Por favor, verifique sua caixa de entrada e siga as instruções.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseRecoveryDialog} className="w-full sm:w-auto">
              <Check className="mr-2 h-4 w-4" /> OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
