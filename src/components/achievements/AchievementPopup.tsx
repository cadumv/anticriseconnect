
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  achievementTitle: string;
  onShare: () => void;
}

export const AchievementPopup = ({
  isOpen,
  onClose,
  userName,
  achievementTitle,
  onShare
}: AchievementPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Trophy className="h-8 w-8" />
            </div>
          </div>
          <DialogTitle className="text-xl">PARABÉNS {userName.toUpperCase()}!</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Você acabou de conquistar a conquista <span className="font-semibold">{achievementTitle}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center mt-4">
          <Button onClick={onShare} className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar essa conquista em seu perfil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
