
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/types/post";
import { PostCardHeader } from "@/components/post/card/PostCardHeader";
import { PostCardMedia } from "@/components/post/card/PostCardMedia";
import { PostCardActions } from "@/components/post/card/PostCardActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, HandshakeIcon, GraduationCap, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";

interface OpportunityCardProps {
  opportunity: Post;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  isOwner?: boolean;
}

export function OpportunityCard({
  opportunity,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  isOwner = false
}: OpportunityCardProps) {
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  
  const metadata = opportunity.metadata || {};
  const title = opportunity.title || metadata.title || "Oportunidade de parceria";
  const location = metadata.location;
  const partnerCount = metadata.partnerCount || "Não especificado";
  const deadline = metadata.deadline;
  
  // Get image URL from either image_url or imageUrl property
  const imageUrl = opportunity.image_url || opportunity.imageUrl;
  
  const handleRequestPartnership = () => {
    toast.success("Solicitação de parceria enviada com sucesso!");
    // In a real application, this would send a request to the backend
  };

  // Check if current user is connected with post owner
  const isConnected = () => {
    // In a real implementation, this would check if users are connected
    // For now, we'll return a random value for demo purposes
    return Math.random() > 0.5;
  };

  const handleConnectRequest = () => {
    setIsConnectionDialogOpen(true);
  };
  
  return (
    <Card className="overflow-hidden">
      <PostCardHeader 
        post={opportunity}
        onSave={() => onSave(opportunity.id)}
      />
      
      <CardContent className="p-4 pt-0">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        
        <div className="mb-3">
          {opportunity.content && (
            <p className="text-gray-700 mb-3">{opportunity.content}</p>
          )}
          
          {imageUrl && (
            <div className="mb-3">
              <PostCardMedia 
                imageUrl={imageUrl}
                title={title}
              />
            </div>
          )}
          
          {metadata.skills && metadata.skills.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-md mb-3 border border-blue-100">
              <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium">
                <GraduationCap className="h-5 w-5" />
                <h4>Habilidades Necessárias:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-white text-blue-600 border-blue-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {metadata.engineeringType && (
            <div className="mb-3">
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                {metadata.engineeringType}
              </Badge>
            </div>
          )}
          
          <div className="space-y-1 text-sm text-gray-600 mt-3">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Parceiros necessários: {partnerCount}</span>
            </div>
            
            {deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Prazo: {new Date(deadline).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
          
          {!isOwner && (
            <div className="mt-4 space-y-2">
              {!isConnected() && (
                <Button 
                  onClick={handleConnectRequest} 
                  className="w-full mb-2"
                  variant="outline"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Conectar com o autor
                </Button>
              )}
              <Button 
                onClick={handleRequestPartnership} 
                className="w-full"
                variant="outline"
              >
                <HandshakeIcon className="mr-2 h-4 w-4" />
                Solicitar parceria
              </Button>
            </div>
          )}
        </div>
        
        <PostCardActions
          postId={opportunity.id}
          liked={liked}
          saved={saved}
          onLike={onLike}
          onSave={onSave}
          onShare={onShare}
          onComment={() => {}}
        />
      </CardContent>

      {/* Connection Request Dialog */}
      {opportunity.user_id && (
        <ConnectionRequestDialog
          isOpen={isConnectionDialogOpen}
          onClose={() => setIsConnectionDialogOpen(false)}
          targetProfileName={opportunity.author || "Autor da oportunidade"}
          targetProfileId={opportunity.user_id}
          currentUserId={localStorage.getItem("currentUser") || ""}
        />
      )}
    </Card>
  );
}
