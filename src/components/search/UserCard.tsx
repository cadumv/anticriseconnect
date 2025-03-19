
import { User, Tag, AtSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EngineerProps {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  professional_description: string;
  avatar_url: string | null;
  onClick: (id: string) => void;
}

export const UserCard = ({ 
  id, 
  name, 
  username, 
  engineering_type, 
  professional_description, 
  avatar_url,
  onClick 
}: EngineerProps) => {
  return (
    <Card 
      className="cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
            {avatar_url ? (
              <img 
                src={avatar_url} 
                alt={`Foto de ${name}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{name}</h3>
              {username && (
                <span className="text-gray-500 text-sm flex items-center">
                  <AtSign className="h-3 w-3 mr-0.5" />
                  {username}
                </span>
              )}
              {engineering_type && (
                <Badge variant="outline" className="ml-2">
                  <Tag className="mr-1 h-3 w-3" />
                  {engineering_type}
                </Badge>
              )}
            </div>
            {professional_description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {professional_description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
