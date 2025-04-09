
import { Button } from "@/components/ui/button";

interface ProfileActionButtonsProps {
  isFollowing: boolean;
  followLoading: boolean;
  onFollowToggle: () => void;
  onConnectionRequest: () => void;
}

export const ProfileActionButtons = ({
  isFollowing,
  followLoading,
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
      <button 
        onClick={onConnectionRequest}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Conexão Anticrise
      </button>
    </div>
  );
};
