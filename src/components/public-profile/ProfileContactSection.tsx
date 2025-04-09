
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileContactSectionProps {
  isConnectionAccepted: boolean;
  onOpenConnectionDialog: () => void;
}

export const ProfileContactSection = ({ 
  isConnectionAccepted, 
  onOpenConnectionDialog 
}: ProfileContactSectionProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="pt-4 border-t text-left">
          <h3 className="text-base font-semibold mb-2">Contato</h3>
          <div className="flex items-center">
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
              disabled={!isConnectionAccepted}
              onClick={onOpenConnectionDialog}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Enviar mensagem
            </button>
            {!isConnectionAccepted && (
              <span className="text-xs text-gray-500 ml-2">
                (Disponível após aceite da conexão)
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
