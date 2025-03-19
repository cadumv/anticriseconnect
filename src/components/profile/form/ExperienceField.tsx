
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

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

interface ExperienceFieldProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}

export const ExperienceField = ({ 
  experiences = [], 
  setExperiences 
}: ExperienceFieldProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        current: false,
        description: ""
      }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    
    // If marking as current position, clear end dates
    if (field === 'current' && value === true) {
      newExperiences[index].endMonth = '';
      newExperiences[index].endYear = '';
    }
    
    setExperiences(newExperiences);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Experiência</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddExperience}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Adicione sua experiência profissional clicando no botão acima.
            </p>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="space-y-4 border border-gray-200 rounded-md p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Empresa</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="Ex: Empresa de Engenharia XYZ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`position-${index}`}>Cargo</Label>
                      <Input
                        id={`position-${index}`}
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                        placeholder="Ex: Engenheiro Civil Sênior"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Localização</Label>
                    <Input
                      id={`location-${index}`}
                      value={exp.location}
                      onChange={(e) => updateExperience(index, "location", e.target.value)}
                      placeholder="Ex: São Paulo, SP"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Data de Início</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={exp.startMonth}
                          onValueChange={(value) => updateExperience(index, "startMonth", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Mês" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, i) => (
                              <SelectItem key={month} value={(i + 1).toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={exp.startYear}
                          onValueChange={(value) => updateExperience(index, "startYear", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ano" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Data de Término</Label>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`current-${index}`} className="text-sm font-normal">
                            Cargo atual
                          </Label>
                          <input
                            type="checkbox"
                            id={`current-${index}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(index, "current", e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                      {!exp.current && (
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={exp.endMonth}
                            onValueChange={(value) => updateExperience(index, "endMonth", value)}
                            disabled={exp.current}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Mês" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month, i) => (
                                <SelectItem key={month} value={(i + 1).toString()}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={exp.endYear}
                            onValueChange={(value) => updateExperience(index, "endYear", value)}
                            disabled={exp.current}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Descrição</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      placeholder="Descreva suas responsabilidades e conquistas neste cargo"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
