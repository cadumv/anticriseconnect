
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { ProfileAvatar } from "./ProfileAvatar";
import { AreasOfExpertise } from "./AreasOfExpertise";
import { ProfileDescriptionGenerator } from "./ProfileDescriptionGenerator";
import { EngineeringTypeSelect } from "./EngineeringTypeSelect";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileFormProps {
  user: User;
  setIsEditingProfile: (isEditing: boolean) => void;
}

export const ProfileForm = ({ user, setIsEditingProfile }: ProfileFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [engineeringType, setEngineeringType] = useState(user?.user_metadata?.engineering_type || "");
  const [professionalDescription, setProfessionalDescription] = useState(
    user?.user_metadata?.professional_description || ""
  );
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>(
    user?.user_metadata?.areas_of_expertise || ["", "", ""]
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");

  const updateAreasOfExpertise = (index: number, value: string) => {
    const updatedAreas = [...areasOfExpertise];
    updatedAreas[index] = value;
    setAreasOfExpertise(updatedAreas);
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameError("");
      setUsernameAvailable(true);
      return;
    }

    if (username === user?.user_metadata?.username) {
      // User is not changing their username
      setUsernameError("");
      setUsernameAvailable(true);
      return;
    }

    // Username format validation
    // Updated regex to match the required format:
    // - Must start with a letter
    // - Can contain lowercase letters, numbers, underscores and dots
    // - No special characters, spaces, uppercase letters, or accents
    // - Length between 3 and 20 characters
    if (!/^[a-z][a-z0-9._]{2,19}$/.test(username)) {
      setUsernameError("Nome de usuário deve conter entre 3 e 20 caracteres, iniciando com uma letra minúscula, seguido por letras minúsculas, números, pontos ou underscores. Sem espaços, acentos ou caracteres especiais.");
      setUsernameAvailable(false);
      return;
    }

    // Prevent usernames that look like phones, CPFs, etc.
    if (/^\d{3,}$/.test(username) || // Sequence of 3+ digits
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(username) || // CPF pattern
        /^\(\d{2}\)\s*\d{4,5}-\d{4}$/.test(username)) { // Phone pattern
      setUsernameError("Nome de usuário não pode ser um número de telefone, CPF ou sequência de números.");
      setUsernameAvailable(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUsernameError("Este nome de usuário já está em uso.");
        setUsernameAvailable(false);
      } else {
        setUsernameError("");
        setUsernameAvailable(true);
      }
    } catch (error: any) {
      console.error("Erro ao verificar disponibilidade do nome de usuário:", error);
      setUsernameError("Erro ao verificar disponibilidade.");
      setUsernameAvailable(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameAvailable) {
      toast({
        title: "Nome de usuário indisponível",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Filtrar áreas de expertise vazias
      const filteredAreas = areasOfExpertise.filter(area => area.trim() !== "");
      
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          username,
          phone, 
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          avatar_url: avatarUrl
        }
      });
      
      if (error) throw error;
      
      // Also update the profiles table with the username
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name,
          username,
          engineering_type: engineeringType,
          professional_description: professionalDescription,
          areas_of_expertise: filteredAreas,
          avatar_url: avatarUrl,
          phone
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
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
          <Label htmlFor="username">Nome de usuário</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">@</span>
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="seu_nome_de_usuario"
              className="pl-8"
            />
          </div>
          {usernameError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{usernameError}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            Use letras minúsculas, números, pontos e underscores. Entre 3 e 20 caracteres. Deve começar com uma letra.
          </p>
        </div>
        
        <EngineeringTypeSelect 
          engineeringType={engineeringType}
          setEngineeringType={setEngineeringType}
        />
        
        <div className="grid gap-2">
          <Label>Áreas de atuação em que atua ou gostaria de atuar</Label>
          <AreasOfExpertise 
            areasOfExpertise={areasOfExpertise} 
            updateAreasOfExpertise={updateAreasOfExpertise}
          />
        </div>

        <ProfileDescriptionGenerator
          engineeringType={engineeringType}
          areasOfExpertise={areasOfExpertise}
          professionalDescription={professionalDescription}
          setProfessionalDescription={setProfessionalDescription}
        />
        
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
          <Button type="submit" disabled={loading || !usernameAvailable}>
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
