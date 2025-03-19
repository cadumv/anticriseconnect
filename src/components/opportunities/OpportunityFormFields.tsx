
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EngineeringTypeSelect } from "@/components/profile/EngineeringTypeSelect";
import { ImageUploader } from "@/components/post/ImageUploader";

interface OpportunityFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  partnerCount: string;
  setPartnerCount: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  skills: string;
  setSkills: (value: string) => void;
  engineeringType: string;
  setEngineeringType: (value: string) => void;
  imageFile: File | null;
  imagePreview: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
}

export function OpportunityFormFields({
  title,
  setTitle,
  description,
  setDescription,
  location,
  setLocation,
  partnerCount,
  setPartnerCount,
  deadline,
  setDeadline,
  skills,
  setSkills,
  engineeringType,
  setEngineeringType,
  imageFile,
  imagePreview,
  setImageFile,
  setImagePreview
}: OpportunityFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
