
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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da sua publicação"
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
        />
      </div>
    </>
  );
}
