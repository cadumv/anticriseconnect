
import React, { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardMediaProps {
  imageUrl?: string;
  imageUrls?: string[];
  title?: string;
  compact?: boolean;
}

export function PostCardMedia({ imageUrl, imageUrls, title, compact = false }: PostCardMediaProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle both single imageUrl and multiple imageUrls
  const images = imageUrls?.length ? imageUrls : (imageUrl ? [imageUrl] : []);
  
  if (images.length === 0) return null;
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className={`${compact ? 'mb-2' : 'mb-3'} relative`}>
      <AspectRatio ratio={compact ? 3/1 : 4/3}>
        <img 
          src={images[currentImageIndex]} 
          alt={title || "Imagem da publicação"} 
          className="object-cover w-full h-full rounded-sm"
        />
      </AspectRatio>
      
      {images.length > 1 && (
        <>
          <Button 
            onClick={handlePrevImage} 
            size="icon" 
            variant="ghost" 
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleNextImage} 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex gap-1.5">
              {images.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
