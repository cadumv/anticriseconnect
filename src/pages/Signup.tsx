
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/SignupForm";
import { ReferralNotice } from "@/components/auth/ReferralNotice";
import { SignupFooter } from "@/components/auth/SignupFooter";

const Signup = () => {
  const [referrerId, setReferrerId] = useState("");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para conectar-se com outros engenheiros
          </CardDescription>
          <ReferralNotice referrerId={referrerId} />
        </CardHeader>
        <CardContent>
          <SignupForm referrerId={referrerId} />
        </CardContent>
        <SignupFooter />
      </Card>
    </div>
  );
};

export default Signup;
