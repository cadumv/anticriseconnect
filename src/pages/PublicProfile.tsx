
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";
import { ProfileHeader } from "@/components/public-profile/ProfileHeader";
import { ProfileDetails } from "@/components/public-profile/ProfileDetails";
import { ProfileContact } from "@/components/public-profile/ProfileContact";
import { ProfileLoadingState } from "@/components/public-profile/ProfileLoadingState";
import { ProfileErrorState } from "@/components/public-profile/ProfileErrorState";
import { Achievements } from "@/components/Achievements";

interface ProfileData {
  id: string;
  name: string;
  engineering_type: string;
  professional_description: string;
  areas_of_expertise: string[];
  avatar_url: string | null;
  phone: string;
}

interface Publication {
  id: string;
  title: string;
  snippet: string;
  date: string;
}

const DEMO_PROFILE: ProfileData = {
  id: "demo-profile-123",
  name: "João",
  engineering_type: "Engenharia Civil",
  professional_description: "Engenheiro civil com experiência em projetos estruturais e gerenciamento de obras residenciais e comerciais. Especialista em cálculos estruturais e soluções sustentáveis para construções.",
  areas_of_expertise: ["Projetos Estruturais", "Gerenciamento de Obras", "Construção Sustentável", "Consultoria Técnica"],
  avatar_url: null,
  phone: "(11) 98765-4321"
};

const DEMO_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    title: "Análise comparativa de métodos estruturais em edificações residenciais",
    snippet: "Estudo sobre diferentes abordagens de design estrutural e seu impacto na eficiência e custo de construções residenciais de médio porte.",
    date: "15/03/2023"
  },
  {
    id: "pub-2",
    title: "Sustentabilidade aplicada em projetos de infraestrutura urbana",
    snippet: "Técnicas e materiais eco-amigáveis para melhorar a sustentabilidade em projetos de infraestrutura urbana sem comprometer a durabilidade.",
    date: "22/11/2022"
  }
];

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
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
          setPublications(DEMO_PUBLICATIONS);
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
        
        // In the future, fetch real publications from the database
        // For now we're using empty array for non-demo profiles
        setPublications([]);
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

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (error || !profile) {
    return <ProfileErrorState error={error} />;
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
          <ProfileHeader 
            profile={profile}
            currentUser={user}
            isFollowing={isFollowing}
            followLoading={followLoading}
            onFollowToggle={handleFollowToggle}
            onConnectionRequest={handleConnectionRequest}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <ProfileDetails 
              description={profile.professional_description}
              areasOfExpertise={profile.areas_of_expertise}
            />
            
            <ProfileContact phone={profile.phone} />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Achievements showProfileSpecific={true} profileId={profile.id} isDemoProfile={id === "demo"} />
      
      {/* Publications Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Publicações</h2>
        </CardHeader>
        <CardContent>
          {publications.length > 0 ? (
            <div className="space-y-6">
              {publications.map((publication) => (
                <div key={publication.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-lg">{publication.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{publication.snippet}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Publicado em {publication.date}</span>
                    <Button variant="link" size="sm" className="p-0">Ler mais</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma publicação encontrada</p>
            </div>
          )}
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
