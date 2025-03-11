
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { InfoPanel } from "@/components/auth/InfoPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { AppStoreBadges } from "@/components/auth/AppStoreBadges";
import { RecoveryDialog } from "@/components/auth/RecoveryDialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryComplete, setRecoveryComplete] = useState(false);
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
          <InfoPanel isRecovery={isRecovery} />
          
          {/* Right side with login form */}
          <div className="bg-white md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <CardHeader className="px-0 pt-2">
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {isRecovery ? "Recuperar senha" : "Iniciar Sessão no Anticrise Connect"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-0">
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
                  />
                ) : (
                  <RecoveryForm 
                    email={email}
                    setEmail={setEmail}
                    handleRecovery={handleRecovery}
                    setIsRecovery={setIsRecovery}
                    loading={loading}
                  />
                )}
              </CardContent>
            </div>
            
            <AppStoreBadges />
          </div>
        </div>
      </Card>

      {/* Recovery email confirmation dialog */}
      <RecoveryDialog 
        open={recoveryComplete}
        onOpenChange={setRecoveryComplete}
        onClose={handleCloseRecoveryDialog}
      />
    </div>
  );
};

export default Login;
