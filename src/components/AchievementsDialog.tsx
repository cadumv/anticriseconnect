
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Achievement } from "@/types/profile";
import { Trophy, Medal, Star, FileText, User, MessageCircle, HandshakeIcon, Gem, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

// Helper function to render the appropriate icon
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'trophy':
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 'medal':
      return <Medal className="h-5 w-5 text-blue-500" />;
    case 'star':
      return <Star className="h-5 w-5 text-yellow-500" />;
    case 'file-text':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'user':
      return <User className="h-5 w-5 text-gray-500" />;
    case 'message-circle':
      return <MessageCircle className="h-5 w-5 text-green-500" />;
    case 'handshake':
      return <HandshakeIcon className="h-5 w-5 text-purple-500" />;
    case 'gem':
      return <Gem className="h-5 w-5 text-indigo-500" />;
    default:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
  }
};

export const AchievementsDialog = ({ isOpen, onClose, achievements }: AchievementsDialogProps) => {
  // Sort achievements: completed first, then by points (highest first)
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? -1 : 1;
    return b.points - a.points;
  });

  const completedAchievements = sortedAchievements.filter(a => a.completed);
  const pendingAchievements = sortedAchievements.filter(a => !a.completed);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Minhas Conquistas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {completedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Conquistas Obtidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {completedAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      {renderIcon(achievement.icon)}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm font-medium text-center">{achievement.title}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Info className="h-4 w-4 text-blue-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-xs text-gray-500">{achievement.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {pendingAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Conquistas Pendentes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pendingAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-60"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      {renderIcon(achievement.icon)}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm font-medium text-center">{achievement.title}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <Info className="h-4 w-4 text-blue-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{achievement.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-xs text-gray-500">{achievement.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
