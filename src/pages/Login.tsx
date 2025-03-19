import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { InfoPanel } from "@/components/auth/InfoPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { AppStoreBadges } from "@/components/auth/AppStoreBadges";
import { RecoveryDialog } from "@/components/auth/RecoveryDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryComplete, setRecoveryComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmationAlert, setShowEmailConfirmationAlert] = useState(false);
  const { signIn, signInWithGoogle, resetPassword, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const justSignedUp = queryParams.get('signup') === 'success';
    
    if (justSignedUp) {
      setShowEmailConfirmationAlert(true);
      const emailParam = queryParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting to home", user);
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');
    
    if (error) {
      console.error("OAuth Error:", error, errorDescription);
      setError(errorDescription || "Ocorreu um erro durante o login.");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Attempting login with:", email);
    try {
      const success = await signIn(email, password);
      console.log("Login result:", success);
      if (!success) {
        setError("Email ou senha inválidos. Por favor, verifique suas credenciais.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === "Email not confirmed") {
        setError("Email não confirmado. Por favor, verifique sua caixa de entrada para o link de confirmação.");
        setShowEmailConfirmationAlert(true);
      } else {
        setError(err.message || "Ocorreu um erro durante o login.");
      }
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Attempting password recovery for:", email);
    try {
      await resetPassword(email);
      setRecoveryComplete(true);
    } catch (err: any) {
      console.error("Recovery error:", err);
      setError(err.message || "Ocorreu um erro ao enviar o email de recuperação.");
    }
  };

  const handleCloseRecoveryDialog = () => {
    setRecoveryComplete(false);
    setIsRecovery(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    console.log("Initiating Google sign in");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.message || "Ocorreu um erro durante o login com Google.");
    }
  };

  const handleResendConfirmation = async () => {
    alert("Por favor verifique seu email para o link de confirmação. Se não recebeu, entre em contato com suporte.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-[900px] shadow-lg border-0 p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <InfoPanel isRecovery={isRecovery} />
          
          <div className="bg-white md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <CardHeader className="px-0 pt-2">
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {isRecovery ? "Recuperar senha" : "Iniciar Sessão no Anticrise Connect"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-0">
                {showEmailConfirmationAlert && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <AlertDescription className="text-blue-700">
                      Confirmação de email necessária. Verifique sua caixa de entrada e confirme seu email antes de fazer login.
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 font-normal ml-1"
                        onClick={handleResendConfirmation}
                      >
                        Reenviar confirmação
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                {!isRecovery ? (
                  <LoginForm 
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    handleGoogleSignIn={handleGoogleSignIn}
                    setIsRecovery={setIsRecovery}
                    loading={loading}
                    error={error || undefined}
                  />
                ) : (
                  <RecoveryForm 
                    email={email}
                    setEmail={setEmail}
                    handleRecovery={handleRecovery}
                    setIsRecovery={setIsRecovery}
                    loading={loading}
                    error={error || undefined}
                  />
                )}
              </CardContent>
            </div>
            
            <AppStoreBadges />
          </div>
        </div>
      </Card>

      <RecoveryDialog 
        open={recoveryComplete}
        onOpenChange={setRecoveryComplete}
        onClose={handleCloseRecoveryDialog}
      />
    </div>
  );
};

export default Login;
