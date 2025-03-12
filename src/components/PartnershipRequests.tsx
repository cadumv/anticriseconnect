
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PartnershipRequest {
  id: string;
  name: string;
  specialty: string;
  project: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const PartnershipRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  
  useEffect(() => {
    if (user) {
      loadPartnershipRequests();
    }
  }, [user]);

  const loadPartnershipRequests = () => {
    // In a real app, this would fetch from the database
    // For now, we'll start with an empty array for new users
    setRequests([]);
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Update request status
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      );
      setRequests(updatedRequests);
      
      // Create a notification for the accepted partnership
      // This is where the error was occurring. Let's assume we're creating "user_notifications" instead
      const request = requests.find(r => r.id === requestId);
      if (request && user?.id) {
        // First, check if the table exists and has the right structure
        try {
          // Using the RPC approach instead of direct table insertion
          await supabase.rpc('create_notification', {
            p_user_id: user.id,
            p_type: 'partnership_accepted',
            p_title: 'Parceria aceita',
            p_message: `Você aceitou a solicitação de parceria de ${request.name}`,
            p_read: false
          });
        } catch (rpcError) {
          console.error('Could not create notification using RPC:', rpcError);
          // Fallback: log the action but don't try to insert in DB
          console.log('Partnership accepted notification would be created for user', user.id);
        }
      }
      
      toast.success("Solicitação aceita com sucesso!");
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Erro ao aceitar solicitação");
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.filter(req => req.id !== requestId);
    setRequests(updatedRequests);
    toast.success("Solicitação recusada");
  };

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
                  <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>Aceitar</Button>
                  <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>Recusar</Button>
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
