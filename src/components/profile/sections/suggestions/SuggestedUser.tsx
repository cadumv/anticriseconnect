
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";

interface SuggestedUserProps {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isFollowed?: boolean;
  type: 'follow' | 'connect';
  onAction: (userId: string) => void;
}

export const SuggestedUser = ({
  id,
  name,
  title,
  subtitle,
  avatarUrl,
  isFollowed,
  type,
  onAction
}: SuggestedUserProps) => {
  const isActionActive = type === 'follow' ? isFollowed : false;
  
  return (
    <div className="flex items-start gap-3 py-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} style={{ objectFit: "contain" }} />
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        <div className="mt-1">
          {type === 'follow' ? (
            <Button 
              variant={isFollowed ? "outline" : "outline"} 
              size="sm" 
              className={`w-full text-xs ${isFollowed ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => onAction(id)}
            >
              {isFollowed ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Seguindo</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Seguir</span>
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => onAction(id)}
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              <span>Conectar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
