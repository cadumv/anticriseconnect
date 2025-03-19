
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ExperienceDateSelector } from "./ExperienceDateSelector";
import { ExperienceLocationField } from "./ExperienceLocationField";
import { ExperienceDescriptionField } from "./ExperienceDescriptionField";

interface Experience {
  company: string;
  position: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Experience, value: any) => void;
}

export const ExperienceItem = ({ 
  experience, 
  index, 
  onRemove, 
  onUpdate 
}: ExperienceItemProps) => {
  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`company-${index}`}>Empresa</Label>
          <Input
            id={`company-${index}`}
            value={experience.company}
            onChange={(e) => onUpdate(index, "company", e.target.value)}
            placeholder="Ex: Empresa de Engenharia XYZ"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`position-${index}`}>Cargo</Label>
          <Input
            id={`position-${index}`}
            value={experience.position}
            onChange={(e) => onUpdate(index, "position", e.target.value)}
            placeholder="Ex: Engenheiro Civil Sênior"
          />
        </div>
      </div>

      <ExperienceLocationField 
        location={experience.location}
        index={index}
        onUpdate={onUpdate}
      />

      <ExperienceDateSelector
        experience={experience}
        index={index}
        onUpdate={onUpdate}
      />

      <ExperienceDescriptionField
        description={experience.description}
        index={index}
        onUpdate={onUpdate}
      />
    </div>
  );
};
