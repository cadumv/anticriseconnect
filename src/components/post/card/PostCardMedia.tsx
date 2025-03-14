
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PostCardMediaProps {
  imageUrl?: string;
  title?: string;
  compact?: boolean;
}

export function PostCardMedia({ imageUrl, title, compact = false }: PostCardMediaProps) {
  if (!imageUrl) return null;
  
  return (
    <div className={`${compact ? 'mb-2' : 'mb-3'}`}>
      <AspectRatio ratio={compact ? 3/1 : 16/9}>
        <img 
          src={imageUrl} 
          alt={title || "Imagem da publicação"} 
          className="object-cover w-full h-full rounded-sm"
        />
      </AspectRatio>
    </div>
  );
}
