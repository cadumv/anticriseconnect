
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoSection } from "@/components/public-profile/ProfileInfoSection";
import { ProfileActionButtons } from "@/components/public-profile/ProfileActionButtons";
import { ProfileAboutSection } from "@/components/public-profile/ProfileAboutSection";
import { ProfileEducationSection } from "@/components/public-profile/ProfileEducationSection";
import { ProfileExperienceSection } from "@/components/public-profile/ProfileExperienceSection";
import { ProfileContactSection } from "@/components/public-profile/ProfileContactSection";
import { UserPostsList } from "@/components/post/UserPostsList";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AchievementsSidebar } from "@/components/achievements/AchievementsSidebar";
import { ProfileSuggestions } from "@/components/profile/sections/ProfileSuggestions";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Edit3 } from "lucide-react";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    profile,
    publications,
    publicationLoading,
    userPosts,
    postsLoading,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  } = usePublicProfile(id, user);

  // For post interactions
  const { 
    liked, 
    saved, 
    handleLikePost, 
    handleSavePost, 
    handleSharePost 
  } = useProfilePostInteractions(user);

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

  // Calculate total achievement points
  const totalPoints = profile?.achievements?.reduce((total, achievement) => {
    return total + (achievement.completed ? achievement.points || 0 : 0);
  }, 0) || 0;

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <BackToSearchButton />
      </div>

      <div>
        {/* Cover image */}
        <div className="rounded-lg overflow-hidden mb-6">
          <div className="h-36 bg-gradient-to-r from-blue-50 to-indigo-100 relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
              disabled={user?.id !== profile.id}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar capa
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row">
                <div className="relative -top-16 mb-2 sm:-top-16 sm:mb-0 sm:mr-4">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Foto de perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-blue-500">
                          {profile.name[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="sm:pt-4 sm:flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="-mt-12 sm:mt-0">
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      {profile.engineering_type && (
                        <p className="text-gray-600 mt-1">{profile.engineering_type} • {" "}
                          <button 
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsConnectionDialogOpen(true)}
                          >
                            Informações de contato
                          </button>
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
                      {user && user.id !== profile.id && (
                        <ProfileActionButtons
                          isFollowing={isFollowing}
                          followLoading={followLoading}
                          onFollowToggle={handleSuccessfulFollowToggle}
                          onConnectionRequest={handleConnectionRequest}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">4 visualizações do perfil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{profile.postCount || 0} publicações</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileAboutSection 
                  description={profile.professional_description} 
                  areasOfExpertise={profile.areas_of_expertise} 
                />
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Experiência</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileExperienceSection experiences={profile.experiences || []} />
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Educação</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileEducationSection education={profile.education || []} />
              </CardContent>
            </Card>

            {/* Tabbed Content for Posts and Publications */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto">
                <TabsTrigger value="posts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  Publicações
                </TabsTrigger>
                <TabsTrigger value="articles" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  Artigos técnicos
                </TabsTrigger>
                <TabsTrigger value="info" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  Contato
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="pt-4">
                {postsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <UserPostsList
                    posts={userPosts}
                    userName={profile.name || "Usuário"}
                    liked={liked}
                    saved={saved}
                    onLike={handleLikePost}
                    onSave={handleSavePost}
                    onShare={handleSharePost}
                  />
                )}
              </TabsContent>

              <TabsContent value="articles" className="pt-4">
                <PublicationsList 
                  publications={publications} 
                  loading={publicationLoading}
                />
              </TabsContent>
              
              <TabsContent value="info" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ProfileContactSection 
                      isConnectionAccepted={isConnectionAccepted}
                      onOpenConnectionDialog={() => setIsConnectionDialogOpen(true)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            <AchievementsSidebar 
              achievements={profile?.achievements || []} 
              totalPoints={totalPoints} 
            />
            <ProfileSuggestions />
          </div>
        </div>
      </div>

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
