
import { Card, CardContent } from "@/components/ui/card";

export const ProfileLoadingState = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Carregando perfil...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
