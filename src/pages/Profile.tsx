
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";

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

const Profile = () => {
  const { user, signOut, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateAreasOfExpertise = (index: number, value: string) => {
    const updatedAreas = [...areasOfExpertise];
    updatedAreas[index] = value;
    setAreasOfExpertise(updatedAreas);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Você precisa selecionar uma imagem para fazer upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Verificar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 2MB.");
      }

      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        throw new Error("O arquivo deve ser uma imagem.");
      }

      // Fazer upload da imagem
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (error) throw error;

      // Gerar URL pública para a imagem
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Atualizar avatarUrl
      setAvatarUrl(urlData.publicUrl);

      toast({
        title: "Avatar atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload do avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
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

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acesso negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProfileHeader />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Minha Conta</CardTitle>
              <CardDescription>Gerencie suas informações de conta</CardDescription>
            </div>
            <Button onClick={() => signOut()}>Sair</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingProfile ? (
            <form onSubmit={updateProfile}>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Foto de perfil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-blue-500">
                          {name?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={uploadAvatar}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        onClick={handleClickUpload} 
                        variant="outline"
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        <Upload size={16} />
                        {uploading ? "Enviando..." : "Alterar foto"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recomendamos 320x320 pixels, com proporção 1:1.
                      </p>
                    </div>
                  </div>
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
                  <Label htmlFor="professional-description">Breve descrição sobre sua atuação profissional</Label>
                  <Textarea
                    id="professional-description"
                    value={professionalDescription}
                    onChange={(e) => setProfessionalDescription(e.target.value)}
                    placeholder="Descreva brevemente sua experiência e atuação profissional"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Áreas de atuação em que atua ou gostaria de atuar</Label>
                  <div className="space-y-2">
                    {areasOfExpertise.map((area, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={area}
                          onChange={(e) => updateAreasOfExpertise(index, e.target.value)}
                          placeholder={`Área ${index + 1}`}
                        />
                        {area && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => updateAreasOfExpertise(index, "")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
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
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Nome</h3>
                  <p>{user.user_metadata?.name || "Não informado"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Tipo de Engenharia</h3>
                  <p>{user.user_metadata?.engineering_type || "Não informado"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Descrição profissional</h3>
                  <p>{user.user_metadata?.professional_description || "Não informado"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Áreas de atuação</h3>
                  {user.user_metadata?.areas_of_expertise && 
                   user.user_metadata.areas_of_expertise.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {user.user_metadata.areas_of_expertise.map((area: string, index: number) => (
                        area && <li key={index}>{area}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Não informado</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Telefone</h3>
                  <p>{user.user_metadata?.phone || "Não informado"}</p>
                </div>
              </div>
              
              <Button onClick={() => setIsEditingProfile(true)}>Editar perfil</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Excluir conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir conta</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os seus dados.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteAccount();
                    setDeleteDialogOpen(false);
                  }}
                >
                  Confirmar exclusão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
