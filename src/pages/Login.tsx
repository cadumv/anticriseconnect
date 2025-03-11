
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LogIn, Mail, User, Key } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-[900px] shadow-lg border-0 p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side with logo and description */}
          <div className="bg-white md:w-1/2 p-8 flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-16 h-16 bg-red-600 transform rotate-0">
              <div className="w-full h-full transform rotate-45 origin-bottom-left"></div>
            </div>
            
            <div className="mt-16">
              <img
                src="/public/lovable-uploads/60f9f29d-cb87-4919-9ab7-082b33c3560c.png"
                alt="Anticrise Connect Logo"
                className="h-16 w-auto mb-10"
              />
              
              <p className="text-gray-700 mt-8 text-sm">
                O Anticrise Connect é uma plataforma de networking para engenheiros. 
                Para participar no Anticrise Connect, por favor junte-se a um grupo local.
              </p>
            </div>
            
            <div className="text-xs text-gray-500 mt-auto">
              <p>Copyright 2023 Anticrise. Todos os direitos reservados.</p>
              <div className="flex gap-2 mt-1">
                <Link to="#" className="text-xs text-red-600 hover:underline">Termos de Utilização</Link>
                <span>|</span>
                <Link to="#" className="text-xs text-red-600 hover:underline">Política de Privacidade</Link>
              </div>
            </div>
          </div>
          
          {/* Right side with login form */}
          <div className="bg-white md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <CardHeader className="px-0 pt-2">
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {isRecovery ? "Recuperar senha" : "Iniciar Sessão no Anticrise Connect"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-0">
                <form onSubmit={isRecovery ? handleRecovery : handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-600">
                      {isRecovery ? "Email" : "Nome de Utilizador"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="border border-gray-300 rounded"
                    />
                  </div>
                  
                  {!isRecovery && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm text-gray-600">Palavra-passe</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading 
                      ? "Processando..." 
                      : isRecovery 
                        ? "Enviar link" 
                        : "INICIAR SESSÃO"}
                  </Button>
                  
                  {!isRecovery && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        ou{" "}
                        <Button 
                          type="button" 
                          variant="link" 
                          className="p-0 h-auto text-red-600 font-normal"
                          onClick={() => setIsRecovery(true)}
                        >
                          clique aqui
                        </Button>{" "}
                        para se registar ou redefinir a sua palavra-passe!
                      </p>
                    </div>
                  )}

                  {isRecovery && (
                    <Button 
                      variant="link" 
                      onClick={() => setIsRecovery(false)}
                      className="w-full p-0 mt-2 text-red-600"
                    >
                      Voltar para o login
                    </Button>
                  )}
                </form>
              </CardContent>
            </div>
            
            <div className="flex justify-center gap-4 mt-10">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" 
                alt="App Store" 
                className="h-10"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
                alt="Google Play" 
                className="h-10"
              />
            </div>
          </div>
        </div>
      </Card>

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
            <Button onClick={handleCloseRecoveryDialog} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
