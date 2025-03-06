
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const PartnershipRequests = () => {
  const { user } = useAuth();
  
  const requests = [
    {
      id: 1,
      name: "João Paulo",
      specialty: "Engenheiro Estrutural",
      project: "Edifício Comercial",
      date: "Há 3 dias"
    },
    {
      id: 2,
      name: "Maria Silva",
      specialty: "Engenheira Elétrica",
      project: "Instalação Industrial",
      date: "Há 1 semana"
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Solicitações de Parceria</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-500">{request.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-gray-500">{request.specialty}</p>
                  </div>
                </div>
                <p className="text-sm mb-1">Projeto: <span className="font-medium">{request.project}</span></p>
                <p className="text-xs text-gray-500 mb-3">{request.date}</p>
                <div className="flex gap-2">
                  <Button size="sm">Aceitar</Button>
                  <Button size="sm" variant="outline">Recusar</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">Você não tem solicitações de parceria</p>
            <Link to="/">
              <Button size="sm" variant="outline">Explorar Projetos</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
