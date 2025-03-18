
import { useState, useEffect } from "react";
import { Trophy, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/types/profile";
import { toast } from "sonner";
import { AchievementsManager } from "@/services/AchievementsManager";
import { useAuth } from "@/hooks/useAuth";

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
  onShare?: () => void;
}

export const AchievementUnlocked = ({ achievement, onClose, onShare }: AchievementUnlockedProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Play sound
    const sound = new Audio("/achievement-sound.mp3");
    sound.volume = 0.5;
    sound.play().catch(e => console.log("Could not play sound:", e));
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for animation to complete
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleShare = () => {
    if (user && achievement) {
      AchievementsManager.shareAchievement(user.id, achievement);
      toast.success(`Conquista "${achievement.title}" compartilhada no feed!`);
      
      if (onShare) {
        onShare();
      }
    }
    
    setIsVisible(false);
    setTimeout(onClose, 500);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className={`
          bg-black/70 fixed inset-0 transition-opacity duration-300 
          ${isVisible ? 'opacity-100' : 'opacity-0'} 
          overflow-hidden
        `}
      >
        {/* Confetti/sparkles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-4 h-4 rotate-45 bg-yellow-400"
                style={{
                  opacity: 0.6 + Math.random() * 0.4,
                  transform: `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className={`
          bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 transition-all duration-500 pointer-events-auto
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        <div className="relative p-6">
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 500);
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1">Conquista Desbloqueada!</h2>
            <h3 className="text-xl font-semibold mb-2 text-blue-600">{achievement.title}</h3>
            <p className="text-gray-600 mb-4">{achievement.description}</p>
            
            <div className="bg-yellow-100 px-4 py-2 rounded-full text-yellow-800 font-semibold mb-6">
              +{achievement.points} pontos
            </div>
            
            <Button 
              onClick={handleShare}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" /> Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
