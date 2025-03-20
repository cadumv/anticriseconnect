
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ConnectionRequestDialog } from "@/components/ConnectionRequestDialog";
import { ProfileLoadingState } from "@/components/public-profile/ProfileLoadingState";
import { ProfileErrorState } from "@/components/public-profile/ProfileErrorState";
import { Achievements } from "@/components/Achievements";
import { PublicationsList } from "@/components/public-profile/PublicationsList";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { BackToSearchButton } from "@/components/public-profile/BackToSearchButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/ProfileHeader";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    profile,
    publications,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  } = usePublicProfile(id, user);

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

  const handleSuccessfulFollowToggle = async () => {
    await handleFollowToggle();
    toast.success(isFollowing ? 
      `Você deixou de seguir ${profile.name}` : 
      `Você está seguindo ${profile.name}`
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-4">
        <BackToSearchButton />
      </div>

      {/* Profile Header Section */}
      <Card className="shadow-sm">
        <CardHeader>
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
                  <span className="text-3xl font-bold text-blue-500">
                    {profile.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div>
                  {profile.engineering_type && (
                    <div className="mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                      {profile.engineering_type}
                    </div>
                  )}
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.username && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <span className="mr-1">@</span>
                      <span>{profile.username}</span>
                    </div>
                  )}
                </div>
                
                {profile.professional_description && (
                  <p className="mt-2 text-sm text-gray-700">{profile.professional_description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {user && user.id !== profile.id && (
                <>
                  <button 
                    onClick={handleSuccessfulFollowToggle}
                    disabled={followLoading}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                      isFollowing 
                        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isFollowing ? "Seguindo" : "Seguir"}
                  </button>
                  <button 
                    onClick={handleConnectionRequest}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Conexão Anticrise
                  </button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto">
          <TabsTrigger value="info" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Informações
          </TabsTrigger>
          <TabsTrigger value="posts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Publicações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="pt-4 space-y-6">
          {/* Professional Description */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6 text-left">
                {profile.professional_description && (
                  <div>
                    <h3 className="text-base font-semibold mb-3">Sobre</h3>
                    <p className="text-gray-700">{profile.professional_description}</p>
                  </div>
                )}
                
                {profile.areas_of_expertise && profile.areas_of_expertise.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold mb-3">Áreas de atuação</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {profile.areas_of_expertise.map((area, index) => (
                        area && <li key={index} className="text-gray-700">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                        <span className="text-amber-600 font-semibold text-sm">
                          {edu.institution ? edu.institution.substring(0, 3).toUpperCase() : "EDU"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{edu.institution || "Instituição não informada"}</h3>
                        <p className="text-sm text-gray-700">
                          {edu.degree && edu.fieldOfStudy ? `${edu.degree} em ${edu.fieldOfStudy}` : 
                          edu.degree ? edu.degree : 
                          edu.fieldOfStudy ? edu.fieldOfStudy : "Curso não informado"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {edu.startYear && edu.endYear ? 
                            `${edu.startYear} - ${edu.endYear === "Atual" ? "Atual" : edu.endYear}` : 
                            "Período não informado"}
                        </p>
                        {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Experience Section */}
          {profile.experiences && profile.experiences.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-base font-semibold">Experiência profissional</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-6">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {exp.company ? exp.company.substring(0, 3).toUpperCase() : "EXP"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{exp.position || "Cargo não informado"}</h3>
                        <p className="text-sm text-gray-700">{exp.company || "Empresa não informada"}</p>
                        <p className="text-xs text-gray-500">
                          {exp.startMonth && exp.startYear ? 
                            `${exp.startMonth}/${exp.startYear} - ${exp.current ? 'Atual' : 
                            (exp.endMonth && exp.endYear ? `${exp.endMonth}/${exp.endYear}` : 'Fim não informado')}` : 
                            "Período não informado"}
                        </p>
                        {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                        {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Contact Section */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="pt-4 border-t text-left">
                <h3 className="text-base font-semibold mb-2">Contato</h3>
                <div className="flex items-center">
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
                    disabled={!isConnectionAccepted}
                    onClick={() => setIsConnectionDialogOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Enviar mensagem
                  </button>
                  {!isConnectionAccepted && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Disponível após aceite da conexão)
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="pt-4">
          <PublicationsList publications={publications} />
        </TabsContent>
      </Tabs>

      <Achievements 
        showProfileSpecific={true} 
        profileId={profile.id} 
        isDemoProfile={id === "demo"} 
      />

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
