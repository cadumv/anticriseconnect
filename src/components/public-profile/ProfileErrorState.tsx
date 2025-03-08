
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface ProfileErrorStateProps {
  error: string;
}

export const ProfileErrorState = ({ error }: ProfileErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-destructive">{error || "Perfil não encontrado"}</p>
            <Button onClick={() => navigate("/profile/demo")} variant="default" className="mb-2">
              Ver Perfil de Demonstração
            </Button>
            <Link to="/search">
              <Button variant="outline">Voltar para busca</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
