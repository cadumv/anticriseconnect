
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ProfileActionButtonsProps {
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionPending: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileActionButtons = ({
  isFollowing,
  followLoading,
  isConnectionPending,
  onFollowToggle,
  onConnectionRequest
}: ProfileActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={onFollowToggle}
        disabled={followLoading}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
          isFollowing 
            ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isFollowing ? "Seguindo" : "Seguir"}
      </button>
      {isConnectionPending ? (
        <button 
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 border border-yellow-300 bg-yellow-50 text-yellow-700 h-10 px-4 py-2"
        >
          <Clock className="h-4 w-4" />
          Solicitação pendente
        </button>
      ) : (
        <button 
          onClick={onConnectionRequest}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Conexão Anticrise
        </button>
      )}
    </div>
  );
};
