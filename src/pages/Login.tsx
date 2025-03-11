
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LogIn, Mail, User, Key, GithubIcon } from "lucide-react";
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
            <div className="absolute top-0 left-0 w-16 h-16 bg-blue-600 transform rotate-0">
              <div className="w-full h-full transform rotate-45 origin-bottom-left"></div>
            </div>
            
            <div className="mt-16">
              <h1 className="text-4xl font-bold text-blue-600 mb-6">Anticrise Connect</h1>
              
              <p className="text-gray-700 mt-8 text-sm">
                Chegou o Anticrise Connect! 🌎

                A rede social exclusiva para engenheiros(as) que querem se conectar, criar oportunidades e fechar parcerias com profissionais de todo o Brasil!

                <div className="mt-4">
                  <p>🔹 Networking estratégico</p>
                  <p>🔹 Novas oportunidades de negócios</p>
                  <p>🔹 Conexão com engenheiros de todas as áreas</p>
                </div>

                <p className="mt-4">Junte-se agora e faça parte dessa revolução na engenharia!</p>
              </p>
            </div>
            
            <div className="text-xs text-gray-500 mt-auto">
              <p>Copyright 2025 Anticrise. Todos os direitos reservados.</p>
              <div className="flex gap-2 mt-1">
                <Link to="#" className="text-xs text-blue-600 hover:underline">Termos de Utilização</Link>
                <span>|</span>
                <Link to="#" className="text-xs text-blue-600 hover:underline">Política de Privacidade</Link>
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
                  
                  {!isRecovery && (
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
                        : "INICIAR SESSÃO"}
                  </Button>
                  
                  {!isRecovery && (
                    <>
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
                    </>
                  )}

                  {isRecovery && (
                    <Button 
                      variant="link" 
                      onClick={() => setIsRecovery(false)}
                      className="w-full p-0 mt-2 text-blue-600"
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
