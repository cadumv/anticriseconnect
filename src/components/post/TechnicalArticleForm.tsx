
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TechnicalArticleFormProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  company: string;
  setCompany: (company: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  mainContent: string;
  setMainContent: (mainContent: string) => void;
  conclusions: string;
  setConclusions: (conclusions: string) => void;
  content: string;
  setContent: (content: string) => void;
  userName?: string;
}

export function TechnicalArticleForm({
  title,
  setTitle,
  author,
  setAuthor,
  company,
  setCompany,
  summary,
  setSummary,
  mainContent,
  setMainContent,
  conclusions,
  setConclusions,
  content,
  setContent,
  userName
}: TechnicalArticleFormProps) {
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
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={userName || "Seu nome"}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Empresa ou Experiência <span className="text-sm text-gray-500">(Opcional)</span></Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Onde você aplicou este conhecimento?"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Resumo do Artigo</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Breve introdução explicando o que será abordado"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mainContent">Conteúdo Principal</Label>
        <Textarea
          id="mainContent"
          value={mainContent}
          onChange={(e) => setMainContent(e.target.value)}
          placeholder="Explicação técnica detalhada, problemas enfrentados, soluções aplicadas..."
          rows={10}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="conclusions">Principais Conclusões <span className="text-sm text-gray-500">(Opcional)</span></Label>
        <Textarea
          id="conclusions"
          value={conclusions}
          onChange={(e) => setConclusions(e.target.value)}
          placeholder="Destaque os aprendizados e recomendações finais"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo Simplificado (exibido no feed)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Versão resumida do seu artigo para exibição no feed"
          rows={4}
        />
      </div>
    </>
  );
}
