
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface EducationFieldProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

export const EducationField = ({ 
  education = [], 
  setEducation 
}: EducationFieldProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        description: ""
      }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducation(newEducation);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Formação Acadêmica</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddEducation}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Adicione sua formação acadêmica clicando no botão acima.
            </p>
          ) : (
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="space-y-4 border border-gray-200 rounded-md p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Instituição</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        placeholder="Ex: Universidade Federal de São Paulo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Grau</Label>
                      <Select
                        value={edu.degree}
                        onValueChange={(value) => updateEducation(index, "degree", value)}
                      >
                        <SelectTrigger id={`degree-${index}`}>
                          <SelectValue placeholder="Selecione o grau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bacharelado">Bacharelado</SelectItem>
                          <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                          <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
                          <SelectItem value="Especialização">Especialização</SelectItem>
                          <SelectItem value="MBA">MBA</SelectItem>
                          <SelectItem value="Mestrado">Mestrado</SelectItem>
                          <SelectItem value="Doutorado">Doutorado</SelectItem>
                          <SelectItem value="Técnico">Técnico</SelectItem>
                          <SelectItem value="Curso Livre">Curso Livre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`fieldOfStudy-${index}`}>Área de Estudo</Label>
                    <Input
                      id={`fieldOfStudy-${index}`}
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                      placeholder="Ex: Engenharia Civil"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`startYear-${index}`}>Ano de Início</Label>
                      <Select
                        value={edu.startYear}
                        onValueChange={(value) => updateEducation(index, "startYear", value)}
                      >
                        <SelectTrigger id={`startYear-${index}`}>
                          <SelectValue placeholder="Selecione o ano" />
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

                    <div className="space-y-2">
                      <Label htmlFor={`endYear-${index}`}>Ano de Conclusão</Label>
                      <Select
                        value={edu.endYear}
                        onValueChange={(value) => updateEducation(index, "endYear", value)}
                      >
                        <SelectTrigger id={`endYear-${index}`}>
                          <SelectValue placeholder="Selecione o ano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Atual">Atual</SelectItem>
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
                    <Label htmlFor={`description-${index}`}>Descrição</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={edu.description}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      placeholder="Descreva sua experiência acadêmica, projetos relevantes, etc."
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
