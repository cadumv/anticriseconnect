
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ProfileAboutProps {
  user: User;
}

export const ProfileAbout = ({ user }: ProfileAboutProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(user.user_metadata?.professional_description || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          professional_description: description 
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          professional_description: description
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      toast({
        title: "Descrição atualizada com sucesso",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar descrição",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(user.user_metadata?.professional_description || "");
    setIsEditing(false);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-semibold">Sobre</CardTitle>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(true)}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição profissional"
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700">
            {user.user_metadata?.professional_description || "Adicione uma descrição profissional para que outros usuários saibam mais sobre você."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
