
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export const ProfileAnalytics = () => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-4">
            <div className="text-xs text-gray-500">Visualizações do perfil</div>
            <div className="font-semibold mt-1">4</div>
            <div className="text-xs text-gray-500 mt-1">Saiba quem viu seu perfil</div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500">Impressão das publicações</div>
            <div className="font-semibold mt-1">0</div>
            <div className="text-xs text-gray-500 mt-1">
              Comece uma publicação para aumentar o engajamento
            </div>
            <div className="text-xs text-gray-500 mt-1">Últimos 7 dias</div>
          </div>
        </div>
        <div className="border-t p-2 text-right">
          <Link to="#" className="text-xs text-blue-600 hover:underline">
            Exibir todas as análises →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
