
import React, { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/post/ImageUploader";
import { EngineeringTypeSelect } from "@/components/profile/EngineeringTypeSelect";

interface NewOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpportunityCreated: () => void;
}

export function NewOpportunityDialog({
  open,
  onOpenChange,
  onOpportunityCreated
}: NewOpportunityDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [partnerCount, setPartnerCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [engineeringType, setEngineeringType] = useState("");
  
  // For the image uploader
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl(null);
    setImageFile(null);
    setImagePreview(null);
    setLocation("");
    setPartnerCount("");
    setDeadline("");
    setSkills("");
    setEngineeringType("");
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para publicar uma oportunidade");
      return;
    }
    
    if (!title || !description) {
      toast.error("Título e descrição são obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create skills array from comma-separated string
      const skillsArray = skills
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill !== "");
      
      // Create the post in Supabase
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: title,
          content: description,
          image_url: imageUrl,
          user_id: user.id,
          metadata: {
            type: "opportunity",
            location: location,
            partnerCount: partnerCount,
            deadline: deadline,
            skills: skillsArray,
            engineeringType: engineeringType
          }
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Oportunidade publicada com sucesso!");
      onOpportunityCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("Erro ao publicar oportunidade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar nova oportunidade</DialogTitle>
          <DialogDescription>
            Compartilhe uma oportunidade de parceria em projetos de engenharia
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da oportunidade *</Label>
            <Input
              id="title"
              placeholder="Ex: Busco parceiro para projeto de instalações elétricas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva a oportunidade em detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="engineeringType">Área de Engenharia</Label>
            <EngineeringTypeSelect
              engineeringType={engineeringType}
              setEngineeringType={setEngineeringType}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Cidade, Estado"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partnerCount">Número de parceiros</Label>
              <Input
                id="partnerCount"
                placeholder="Ex: 1-2"
                value={partnerCount}
                onChange={(e) => setPartnerCount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo (opcional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Habilidades necessárias (separadas por vírgula)</Label>
            <Input
              id="skills"
              placeholder="Ex: AutoCAD, gestão de projetos, orçamentos"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Imagem (opcional)</Label>
            <ImageUploader
              imageFile={imageFile}
              imagePreview={imagePreview}
              setImageFile={setImageFile}
              setImagePreview={setImagePreview}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar oportunidade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
