
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, PlusCircle } from "lucide-react";

interface InterestsFieldProps {
  interests: string[];
  setInterests: (interests: string[]) => void;
}

export const InterestsField = ({ 
  interests = [],
  setInterests 
}: InterestsFieldProps) => {
  
  const handleAddInterest = () => {
    setInterests([...interests, ""]);
  };

  const handleRemoveInterest = (index: number) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };

  const updateInterest = (index: number, value: string) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Interesses</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddInterest}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Tópicos de interesse profissional</Label>
            {interests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Adicione seus interesses profissionais clicando no botão acima.
              </p>
            ) : (
              <div className="space-y-2">
                {interests.map((interest, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={interest}
                      onChange={(e) => updateInterest(index, e.target.value)}
                      placeholder={`Interesse ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveInterest(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
