
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ArrowLeft, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface ProfileData {
  id: string;
  name: string;
  engineering_type: string;
  professional_description: string;
  areas_of_expertise: string[];
  avatar_url: string | null;
  phone: string;
}

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, engineering_type, professional_description, areas_of_expertise, avatar_url, phone')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        console.error("Erro ao buscar perfil:", err);
        setError("Não foi possível carregar o perfil do profissional.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <p>Carregando perfil...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive">{error || "Perfil não encontrado"}</p>
              <Link to="/search">
                <Button>Voltar para busca</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-4">
        <Link to="/search">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar para busca
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={`Foto de ${profile.name}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-blue-500" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                {profile.engineering_type && (
                  <Badge className="mt-2">{profile.engineering_type}</Badge>
                )}
              </div>
            </div>

            {user && user.id !== profile.id && (
              <div className="flex gap-2">
                <Button variant="outline">Enviar mensagem</Button>
                <Button>Propor parceria</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {profile.professional_description && (
              <div>
                <h3 className="text-sm font-medium mb-2">Descrição profissional</h3>
                <p className="text-gray-700">{profile.professional_description}</p>
              </div>
            )}
            
            {profile.areas_of_expertise && profile.areas_of_expertise.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Áreas de atuação</h3>
                <ul className="list-disc list-inside">
                  {profile.areas_of_expertise.map((area, index) => (
                    area && <li key={index} className="text-gray-700">{area}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Contato</h3>
              <div className="space-y-2">
                {profile.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4" /> {profile.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfile;
