
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface ProfileAboutProps {
  user: User;
}

export const ProfileAbout = ({ user }: ProfileAboutProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Sobre</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <PencilLine className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-700">
          {user.user_metadata?.professional_description || "Adicione uma descrição profissional para que outros usuários saibam mais sobre você."}
        </p>
      </CardContent>
    </Card>
  );
};
