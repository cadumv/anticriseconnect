
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ProfileAvatar } from "./ProfileAvatar";
import { AreasOfExpertise } from "./AreasOfExpertise";
import { Lightbulb, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Lista de tipos de engenharia
const engineeringTypes = [
  "Engenharia elétrica",
  "Engenharia mecânica",
  "Engenharia mecatrônica",
  "Engenharia de produção",
  "Engenharia química",
  "Engenharia ambiental",
  "Engenharia da computação",
  "Engenharia de alimentos",
  "Engenharia agronômica",
  "Engenharia de petróleo",
  "Engenharia aeronáutica",
  "Engenharia agrícola",
  "Engenharia biomédica",
  "Engenharia de bioprocessos",
  "Engenharia de controle e automação",
  "Engenharia de energia",
  "Engenharia florestal",
  "Engenharia de minas",
  "Engenharia metalúrgica",
  "Engenharia naval",
  "Engenharia de transportes",
  "Engenharia hidráulica",
  "Engenharia de meio ambiente",
  "Engenharia de estruturas",
  "Engenharia urbana",
  "Engenharia geotecnia"
];

interface ProfileFormProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileForm = ({ user, setIsEditingProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [engineeringType, setEngineeringType] = useState(user?.user_metadata?.engineering_type || "");
  const [professionalDescription, setProfessionalDescription] = useState(
    user?.user_metadata?.professional_description || ""
  );
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>(
    user?.user_metadata?.areas_of_expertise || ["", "", ""]
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const updateAreasOfExpertise = (index: number, value: string) => {
    const updatedAreas = [...areasOfExpertise];
    updatedAreas[index] = value;
    setAreasOfExpertise(updatedAreas);
  };

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
          keywords: filteredAreas
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

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filtrar áreas de expertise vazias
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          phone, 
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          avatar_url: avatarUrl
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado com sucesso",
      });
      setIsEditingProfile(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={updateProfile}>
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="avatar">Foto de perfil</Label>
          <ProfileAvatar 
            userId={user.id} 
            avatarUrl={avatarUrl} 
            setAvatarUrl={setAvatarUrl} 
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} disabled />
          <p className="text-sm text-muted-foreground">O email não pode ser alterado</p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="name">Nome do Perfil</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="engineering-type">Tipo de Engenharia</Label>
          <Select 
            value={engineeringType} 
            onValueChange={setEngineeringType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de engenharia" />
            </SelectTrigger>
            <SelectContent>
              {engineeringTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="professional-description">Breve descrição sobre sua atuação profissional</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={generateProfessionalDescription}
                    disabled={isGeneratingDescription || !engineeringType}
                    className="ml-auto"
                  >
                    {isGeneratingDescription ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lightbulb className="h-4 w-4" />
                    )}
                    <span>IA</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Gerar descrição com IA baseada no seu tipo de engenharia e áreas de atuação</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="professional-description"
            value={professionalDescription}
            onChange={(e) => setProfessionalDescription(e.target.value)}
            placeholder="Descreva brevemente sua experiência e atuação profissional"
            rows={3}
          />
          {!engineeringType && (
            <p className="text-xs text-muted-foreground">Selecione um tipo de engenharia para usar a assistência de IA</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Áreas de atuação em que atua ou gostaria de atuar</Label>
          <AreasOfExpertise 
            areasOfExpertise={areasOfExpertise} 
            updateAreasOfExpertise={updateAreasOfExpertise}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(xx) xxxxx-xxxx"
          />
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
};
