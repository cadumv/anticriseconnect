
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OpportunityFormFields } from "./OpportunityFormFields";
import { useOpportunityForm } from "@/hooks/useOpportunityForm";

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
  const {
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
    imageFiles,
    setImageFiles,
    imagePreviews,
    setImagePreviews,
    isSubmitting,
    handleSubmit
  } = useOpportunityForm({
    onOpportunityCreated,
    onOpenChange
  });
  
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
          <OpportunityFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            partnerCount={partnerCount}
            setPartnerCount={setPartnerCount}
            deadline={deadline}
            setDeadline={setDeadline}
            skills={skills}
            setSkills={setSkills}
            engineeringType={engineeringType}
            setEngineeringType={setEngineeringType}
            imageFiles={imageFiles}
            imagePreviews={imagePreviews}
            setImageFiles={setImageFiles}
            setImagePreviews={setImagePreviews}
          />
          
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
