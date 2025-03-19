
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/post/ImageUploader";

interface RegularPostFormProps {
  content: string;
  setContent: (content: string) => void;
  imageFiles: File[];
  imagePreviews: string[];
  setImageFiles: (files: File[]) => void;
  setImagePreviews: (previews: string[]) => void;
}

export function RegularPostForm({
  content,
  setContent,
  imageFiles,
  imagePreviews,
  setImageFiles,
  setImagePreviews
}: RegularPostFormProps) {
  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Compartilhe informações, dicas ou atualizações com outros engenheiros..." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px]"
      />
      
      <ImageUploader
        imageFiles={imageFiles}
        imagePreviews={imagePreviews}
        setImageFiles={setImageFiles}
        setImagePreviews={setImagePreviews}
        multiple={true}
        maxImages={5}
      />
    </div>
  );
}
