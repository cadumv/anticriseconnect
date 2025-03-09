
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut, deleteAccount, loading } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Navigation is handled in the signOut function itself
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProfileHeader />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Minha Conta</CardTitle>
              <CardDescription>Gerencie suas informações de conta</CardDescription>
            </div>
            <Button 
              onClick={handleSignOut} 
              disabled={isSigningOut}
            >
              {isSigningOut ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingProfile ? (
            <ProfileForm user={user} setIsEditingProfile={setIsEditingProfile} />
          ) : (
            <ProfileInfo user={user} setIsEditingProfile={setIsEditingProfile} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <DeleteAccountDialog deleteAccount={deleteAccount} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
