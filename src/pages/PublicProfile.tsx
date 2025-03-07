import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ArrowLeft, User, UserPlus, UserCheck, Handshake } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";

interface ProfileData {
  id: string;
  name: string;
  engineering_type: string;
  professional_description: string;
  areas_of_expertise: string[];
  avatar_url: string | null;
  phone: string;
}

const DEMO_PROFILE: ProfileData = {
  id: "demo-profile-123",
  name: "Ana Oliveira",
  engineering_type: "Engenharia Civil",
  professional_description: "Engenheira civil especializada em projetos sustentáveis e estruturas resilientes. Tenho 10 anos de experiência em projetos residenciais e comerciais, com foco em eficiência energética e redução de impacto ambiental.",
  areas_of_expertise: ["Projetos Estruturais", "Construções Sustentáveis", "Gestão de Obras", "Certificação LEED"],
  avatar_url: null,
  phone: "(11) 98765-4321"
};

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Current ID param:", id);
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (id === "demo") {
          console.log("Loading demo profile");
          setProfile(DEMO_PROFILE);
          setLoading(false);
          return;
        }
        
        if (!id || id === ":id") {
          throw new Error("ID de perfil inválido");
        }
        
        console.log("Fetching profile with ID:", id);
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
    
    const checkFollowStatus = async () => {
      if (user && id && id !== ":id") {
        try {
          const followData = localStorage.getItem(`following_${user.id}`);
          if (followData) {
            const followingList = JSON.parse(followData);
            setIsFollowing(followingList.includes(id));
          }
        } catch (err) {
          console.error("Erro ao verificar status de seguidor:", err);
        }
      }
    };
    
    if (id) {
      fetchProfile();
      checkFollowStatus();
    }
  }, [id, user]);

  const handleFollowToggle = async () => {
    if (!user || !profile) return;
    
    try {
      setFollowLoading(true);
      
      let followingList: string[] = [];
      const followData = localStorage.getItem(`following_${user.id}`);
      
      if (followData) {
        followingList = JSON.parse(followData);
      }
      
      if (isFollowing) {
        followingList = followingList.filter(profileId => profileId !== profile.id);
        toast.success(`Você deixou de seguir ${profile.name}`);
      } else {
        if (!followingList.includes(profile.id)) {
          followingList.push(profile.id);
        }
        toast.success(`Você está seguindo ${profile.name}`);
      }
      
      localStorage.setItem(`following_${user.id}`, JSON.stringify(followingList));
      setIsFollowing(!isFollowing);
      
    } catch (err: any) {
      console.error("Erro ao seguir/deixar de seguir:", err);
      toast.error("Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleConnectionRequest = () => {
    if (!user || !profile) return;
    setIsConnectionDialogOpen(true);
  };

  const goToDemoProfile = () => {
    navigate("/profile/demo");
  };

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
              <Button onClick={() => navigate("/profile/demo")} variant="default" className="mb-2">
                Ver Perfil de Demonstração
              </Button>
              <Link to="/search">
                <Button variant="outline">Voltar para busca</Button>
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
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={isFollowing ? "outline" : "default"} 
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className="gap-1"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4" /> Seguindo
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" /> Seguir
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleConnectionRequest}
                  className="gap-1"
                  variant="secondary"
                >
                  <Handshake className="h-4 w-4" /> Conexão Anticrise
                </Button>
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

      {user && profile && (
        <ConnectionRequestDialog
          isOpen={isConnectionDialogOpen}
          onClose={() => setIsConnectionDialogOpen(false)}
          targetProfileName={profile.name}
          targetProfileId={profile.id}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};

export default PublicProfile;
