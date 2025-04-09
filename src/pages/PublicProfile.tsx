
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
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoSection } from "@/components/public-profile/ProfileInfoSection";
import { ProfileActionButtons } from "@/components/public-profile/ProfileActionButtons";
import { ProfileAboutSection } from "@/components/public-profile/ProfileAboutSection";
import { ProfileEducationSection } from "@/components/public-profile/ProfileEducationSection";
import { ProfileExperienceSection } from "@/components/public-profile/ProfileExperienceSection";
import { ProfileContactSection } from "@/components/public-profile/ProfileContactSection";
import { UserPostsList } from "@/components/post/UserPostsList";
import { useProfilePostInteractions } from "@/hooks/useProfilePostInteractions";

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-4">
        <BackToSearchButton />
      </div>

      {/* Profile Header Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ProfileInfoSection profile={profile} />

            <div className="flex flex-wrap gap-2">
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
          <TabsTrigger value="articles" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            Artigos técnicos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="pt-4 space-y-6">
          {/* About Section */}
          <ProfileAboutSection 
            description={profile.professional_description} 
            areasOfExpertise={profile.areas_of_expertise} 
          />
          
          {/* Education Section */}
          <ProfileEducationSection education={profile.education || []} />
          
          {/* Experience Section */}
          <ProfileExperienceSection experiences={profile.experiences || []} />
          
          {/* Contact Section */}
          <ProfileContactSection 
            isConnectionAccepted={isConnectionAccepted}
            onOpenConnectionDialog={() => setIsConnectionDialogOpen(true)}
          />
        </TabsContent>
        
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
