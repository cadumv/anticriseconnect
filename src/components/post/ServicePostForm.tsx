
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ServicePostFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export function ServicePostForm({ 
  title, 
  setTitle, 
  content, 
  setContent 
}: ServicePostFormProps) {
  // Prevent form submission on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey === false && e.metaKey === false) {
      // Don't do anything special, allow default behavior for textarea
      // This prevents the dialog from closing on Enter
      e.stopPropagation();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da sua publicação"
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Descreva seus serviços ou área de atuação"
          rows={6}
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
}
