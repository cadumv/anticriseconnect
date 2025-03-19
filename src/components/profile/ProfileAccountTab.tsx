
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { Edit3 } from "lucide-react";

interface ProfileAccountTabProps {
  user: User;
}

export const ProfileAccountTab = ({ user }: ProfileAccountTabProps) => {
  const { signOut, deleteAccount } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      setIsSigningOut(false);
    }
  };

  return (
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
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Email</h3>
            <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
              {user.email}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-1">Idioma do perfil</h3>
            <p className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
              Português
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-1">Perfil público e URL</h3>
            <div className="text-base bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 flex justify-between items-center">
              <span className="text-blue-600">
                {user?.user_metadata?.username ? 
                  `app.engenhariaconecta.com.br/${user.user_metadata.username}` : 
                  "Defina um nome de usuário para ter uma URL personalizada"}
              </span>
              <Button variant="ghost" size="sm">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <DeleteAccountDialog deleteAccount={deleteAccount} />
      </CardFooter>
    </Card>
  );
};
