
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, List } from "lucide-react";
import { useState } from "react";

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
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const applyFormatting = (format: 'bold' | 'list') => {
    if (!textareaRef) return;
    
    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = mainContent.substring(start, end);
    
    let formattedText = '';
    let newCursorPosition = end;
    
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
      newCursorPosition = start + formattedText.length;
    } else if (format === 'list') {
      // Split the selected text by new lines
      const lines = selectedText.split('\n');
      formattedText = lines.map(line => `• ${line}`).join('\n');
      newCursorPosition = start + formattedText.length;
    }
    
    const newContent = mainContent.substring(0, start) + formattedText + mainContent.substring(end);
    setMainContent(newContent);
    
    // Set focus back to textarea and restore cursor position after React re-renders
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

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
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={userName || "Seu nome"}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Empresa ou Experiência <span className="text-sm text-gray-500">(Opcional)</span></Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Onde você aplicou este conhecimento?"
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mainContent">Conteúdo Principal</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => applyFormatting('bold')}
            title="Negrito"
          >
            <Bold size={16} />
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => applyFormatting('list')}
            title="Lista com marcadores"
          >
            <List size={16} />
          </Button>
        </div>
        <Textarea
          id="mainContent"
          value={mainContent}
          onChange={(e) => setMainContent(e.target.value)}
          placeholder="Explicação técnica detalhada, problemas enfrentados, soluções aplicadas..."
          rows={10}
          ref={setTextareaRef}
          onKeyDown={handleKeyDown}
        />
        <div className="text-xs text-gray-500 mt-1">
          Dica: Selecione o texto e use os botões acima para formatação. <strong>**Texto**</strong> para negrito, e <strong>•</strong> para marcadores de lista.
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="conclusions">Principais Conclusões <span className="text-sm text-gray-500">(Opcional)</span></Label>
        <Textarea
          id="conclusions"
          value={conclusions}
          onChange={(e) => setConclusions(e.target.value)}
          placeholder="Destaque os aprendizados e recomendações finais"
          rows={3}
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
}
