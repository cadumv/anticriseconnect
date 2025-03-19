
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X } from "lucide-react";

interface ImagePreviewProps {
  previews: string[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ previews, onRemove }: ImagePreviewProps) {
  if (previews.length === 0) return null;
  
  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {previews.map((preview, index) => (
        <div key={index} className="relative">
          <AspectRatio ratio={1}>
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="rounded-md object-cover w-full h-full border"
            />
          </AspectRatio>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => onRemove(index)}
          >
            <X size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}
