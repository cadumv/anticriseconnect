
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PostTypeSelectorProps {
  postType: 'service' | 'technical_article';
  setPostType: (type: 'service' | 'technical_article') => void;
}

export function PostTypeSelector({ postType, setPostType }: PostTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <RadioGroup
        value={postType}
        onValueChange={(value) => setPostType(value as 'service' | 'technical_article')}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="service" id="service" />
          <Label htmlFor="service">Gostaria de publicar um serviço ou área de atuação?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="technical_article" id="technical_article" />
          <Label htmlFor="technical_article">Gostaria de publicar um artigo técnico?</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
