
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAboutSection } from "./ProfileAboutSection";
import { ProfileEducationSection } from "./ProfileEducationSection";
import { ProfileExperienceSection } from "./ProfileExperienceSection";
import { ProfileContactSection } from "./ProfileContactSection";
import { PublicationsList } from "./PublicationsList";
import { UserPostsList } from "@/components/post/UserPostsList";
import { Publication, ProfileData } from "@/types/profile";
import { Post } from "@/types/post";

interface ProfileContentSectionProps {
  profile: ProfileData;
  publications: Publication[];
  publicationLoading: boolean;
  userPosts: Post[];
  postsLoading: boolean;
  isConnectionAccepted: boolean;
  onOpenConnectionDialog: () => void;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onSharePost: (postId: string) => void;
}

export const ProfileContentSection = ({
  profile,
  publications,
  publicationLoading,
  userPosts,
  postsLoading,
  isConnectionAccepted,
  onOpenConnectionDialog,
  liked,
  saved,
  onLikePost,
  onSavePost,
  onSharePost
}: ProfileContentSectionProps) => {
  return (
    <div className="space-y-6">
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
              onLike={onLikePost}
              onSave={onSavePost}
              onShare={onSharePost}
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
                onOpenConnectionDialog={onOpenConnectionDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
