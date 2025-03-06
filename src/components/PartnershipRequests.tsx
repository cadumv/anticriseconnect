
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardList, UserCheck, UserX } from "lucide-react";

interface PartnershipRequest {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  status: "pending" | "accepted" | "rejected";
}

const mockRequests: PartnershipRequest[] = [
  {
    id: "1",
    name: "Carlos Eduardo",
    avatar: "/placeholder.svg",
    specialty: "Engenharia Estrutural",
    status: "pending"
  },
  {
    id: "2",
    name: "Mariana Silva",
    avatar: "/placeholder.svg",
    specialty: "Engenharia Civil",
    status: "pending"
  }
];

export const PartnershipRequests = () => {
  const [requests, setRequests] = useState<PartnershipRequest[]>(mockRequests);
  const { toast } = useToast();

  const handleRequest = (requestId: string, action: "accept" | "reject") => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: action === "accept" ? "accepted" : "rejected" }
        : req
    ));

    toast({
      title: action === "accept" ? "Match aceito!" : "Match recusado",
      description: action === "accept" 
        ? "Uma nova parceria foi estabelecida!"
        : "A solicitação foi recusada.",
      duration: 3000,
    });
  };

  const handleCancelMatch = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: "pending" }
        : req
    ));

    toast({
      title: "Match cancelado",
      description: "A solicitação voltou para a lista de pendentes.",
      duration: 3000,
    });
  };

  const getWeeklyResponses = () => {
    return requests.filter(req => req.status !== "pending");
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Solicitações de Match</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Resumo das atividades
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Resumo das Atividades da Semana</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-4">
                {getWeeklyResponses().map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{request.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {request.specialty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.status === "accepted" ? (
                        <>
                          <div className="flex items-center gap-2 text-green-600">
                            <UserCheck className="h-4 w-4" />
                            <span>Aceito</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="ml-2 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleCancelMatch(request.id)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <UserX className="h-4 w-4" />
                          <span>Recusado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {getWeeklyResponses().length === 0 && (
                  <p className="text-center text-muted-foreground">
                    Nenhuma atividade nesta semana
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {getPendingRequests().length > 0 ? (
            getPendingRequests().map((request) => (
              <div key={request.id} className="flex items-center justify-between p-2 hover:bg-accent/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{request.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {request.specialty}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-red-100 hover:text-red-600"
                    onClick={() => handleRequest(request.id, "reject")}
                  >
                    Recusar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleRequest(request.id, "accept")}
                  >
                    Aceitar
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma solicitação ativa
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
