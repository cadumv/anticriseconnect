
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";

export const ProfileActivities = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Atividades</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            Criar publicação
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-500">
          Você ainda não publicou nada<br />
          As publicações que você compartilhar serão exibidas aqui.
        </p>
        <div className="border-t mt-4 pt-2 text-right">
          <Link to="#" className="text-xs text-blue-600 hover:underline">
            Exibir todas as atividades →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
