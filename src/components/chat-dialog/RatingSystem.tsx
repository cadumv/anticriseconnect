
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface RatingSystemProps {
  initialRating: number | null;
  recipientId: string;
}

export function RatingSystem({ initialRating, recipientId }: RatingSystemProps) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const saveRating = (value: number) => {
    const user = JSON.parse(localStorage.getItem('sb-auth-token') || '{}');
    if (!user?.user?.id) return;
    
    const ratingKey = `chat_rating_${user.user.id}_${recipientId}`;
    localStorage.setItem(ratingKey, value.toString());
    setRating(value);
    
    // Show toast notification
    toast.success("Avaliação salva com sucesso!");
    
    // Check if this is the first rating (achievement trigger)
    const hasRatedBefore = localStorage.getItem('has_rated_conversation');
    if (!hasRatedBefore) {
      localStorage.setItem('has_rated_conversation', 'true');
      // In a real app, you would trigger the achievement on the backend
      toast.success("🏆 Conquista desbloqueada: Primeiro feedback!");
    }
  };
  
  return (
    <div className="px-4 py-2 border-t bg-white">
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-600 mb-1">Avalie esta conversa:</p>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => saveRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
            >
              <Star
                className={`h-6 w-6 ${
                  (hoverRating !== null ? star <= hoverRating : star <= (rating || 0))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
