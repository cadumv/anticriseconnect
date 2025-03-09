
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Loader2, Wand2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileDescriptionGeneratorProps {
  engineeringType: string;
  areasOfExpertise: string[];
  professionalDescription: string;
  setProfessionalDescription: (description: string) => void;
}

export const ProfileDescriptionGenerator = ({
  engineeringType,
  areasOfExpertise,
  professionalDescription,
  setProfessionalDescription
}: ProfileDescriptionGeneratorProps) => {
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);

  const generateProfessionalDescription = async () => {
    setIsGeneratingDescription(true);
    console.log("Starting professional description generation");
    
    try {
      // Filter out empty areas of expertise
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      console.log("Calling Supabase function with:", { 
        engineeringType, 
        keywords: filteredAreas 
      });
      
      const { data, error } = await supabase.functions.invoke('generate-professional-description', {
        body: {
          engineeringType,
          keywords: filteredAreas,
          action: 'generate'
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (data.error) {
        console.error("Data contains error:", data.error);
        throw new Error(data.error);
      }

      console.log("Setting description:", data.description);
      setProfessionalDescription(data.description);
      toast({
        title: "Descrição gerada com sucesso",
        description: "Uma descrição profissional foi criada com base no seu perfil."
      });
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast({
        title: "Erro ao gerar descrição",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const improveProfessionalDescription = async () => {
    if (!professionalDescription.trim()) {
      toast({
        title: "Descrição vazia",
        description: "É necessário ter uma descrição para melhorá-la.",
        variant: "destructive",
      });
      return;
    }

    setIsImprovingDescription(true);
    console.log("Starting professional description improvement");
    
    try {
      // Filter out empty areas of expertise
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      console.log("Calling Supabase function with:", { 
        engineeringType, 
        keywords: filteredAreas,
        currentDescription: professionalDescription,
        action: 'improve' 
      });
      
      const { data, error } = await supabase.functions.invoke('generate-professional-description', {
        body: {
          engineeringType,
          keywords: filteredAreas,
          currentDescription: professionalDescription,
          action: 'improve'
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }

      if (data.error) {
        console.error("Data contains error:", data.error);
        throw new Error(data.error);
      }

      console.log("Setting improved description:", data.description);
      setProfessionalDescription(data.description);
      toast({
        title: "Descrição melhorada com sucesso",
        description: "A IA aprimorou sua descrição profissional."
      });
    } catch (error: any) {
      console.error('Error improving description:', error);
      toast({
        title: "Erro ao melhorar descrição",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsImprovingDescription(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="professional-description">Breve descrição sobre sua atuação profissional</Label>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={improveProfessionalDescription}
                  disabled={!engineeringType || !professionalDescription.trim() || isImprovingDescription}
                >
                  {isImprovingDescription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span className="ml-1">Melhorar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Melhorar a descrição atual com IA</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={generateProfessionalDescription}
                  disabled={!engineeringType || isGeneratingDescription}
                >
                  {isGeneratingDescription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="h-4 w-4" />
                  )}
                  <span className="ml-1">Gerar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerar nova descrição com IA baseada no seu tipo de engenharia e áreas de atuação</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Textarea
        id="professional-description"
        value={professionalDescription}
        onChange={(e) => setProfessionalDescription(e.target.value)}
        placeholder="Descreva brevemente sua experiência e atuação profissional"
        rows={3}
        maxLength={250}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {!engineeringType && "Selecione um tipo de engenharia para usar a assistência de IA"}
        </p>
        <p className="text-xs text-muted-foreground">
          {professionalDescription.length}/250 caracteres
        </p>
      </div>
    </div>
  );
};
