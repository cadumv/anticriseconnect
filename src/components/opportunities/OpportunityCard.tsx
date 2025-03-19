
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/types/post";
import { PostCardHeader } from "@/components/post/card/PostCardHeader";
import { PostCardMedia } from "@/components/post/card/PostCardMedia";
import { PostCardActions } from "@/components/post/card/PostCardActions";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar } from "lucide-react";

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
  const metadata = opportunity.metadata || {};
  const title = opportunity.title || metadata.title || "Oportunidade de parceria";
  const location = metadata.location;
  const partnerCount = metadata.partnerCount || "Não especificado";
  const deadline = metadata.deadline;
  
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
          
          {opportunity.imageUrl && (
            <div className="mb-3">
              <PostCardMedia 
                imageUrl={opportunity.imageUrl}
                title={title}
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 my-2">
            {metadata.skills && metadata.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {skill}
              </Badge>
            ))}
            
            {metadata.engineeringType && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                {metadata.engineeringType}
              </Badge>
            )}
          </div>
          
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
                <span>Prazo: {deadline}</span>
              </div>
            )}
          </div>
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
    </Card>
  );
}
