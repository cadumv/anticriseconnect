
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LogIn, Mail, ArrowRight, User, Key } from "lucide-react";
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
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting login with:", email);
    const success = await signIn(email, password);
    console.log("Login result:", success);
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
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <img
              src="/public/lovable-uploads/60f9f29d-cb87-4919-9ab7-082b33c3560c.png"
              alt="Anticrise Connect Logo"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-950 mb-4">
            Anticrise Connect
          </h1>
          <p className="text-gray-600 mb-6">
            A plataforma de networking para engenheiros. Conecte-se com outros profissionais, 
            compartilhe conhecimento e impulsione sua carreira.
          </p>
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              © 2023 Anticrise Connect. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <img
                src="/public/lovable-uploads/60f9f29d-cb87-4919-9ab7-082b33c3560c.png"
                alt="Anticrise Connect Logo"
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-950">
              {isRecovery ? "Recuperar senha" : "Iniciar Sessão"}
            </CardTitle>
            <CardDescription>
              {isRecovery 
                ? "Enviaremos um link para redefinir sua senha" 
                : "Entre com seus dados de acesso"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={isRecovery ? handleRecovery : handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              {!isRecovery && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-sm font-medium text-blue-600"
                      onClick={() => setIsRecovery(true)}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading 
                  ? "Processando..." 
                  : isRecovery 
                    ? "Enviar link" 
                    : "Entrar"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              
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
                    Google
                  </Button>
                </>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pb-6">
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
                    className="text-blue-600 hover:underline font-medium"
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
            <Button onClick={handleCloseRecoveryDialog} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
