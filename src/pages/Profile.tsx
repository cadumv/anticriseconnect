
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";

const Profile = () => {
  const { user, signOut, deleteAccount } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acesso negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
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
            <Button onClick={() => signOut()}>Sair</Button>
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
