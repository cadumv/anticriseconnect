
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Solicitações de Match</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {requests.map((request) => (
            request.status === "pending" && (
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
            )
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
