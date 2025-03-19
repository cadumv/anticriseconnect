
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewOpportunityDialog } from "@/components/opportunities/NewOpportunityDialog";
import { OpportunitiesList } from "@/components/opportunities/OpportunitiesList";
import { Briefcase } from "lucide-react";

const Opportunities = () => {
  const { user } = useAuth();
  const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
  
  // Get posts
  const {
    userPosts,
    savedPosts,
    liked,
    saved,
    isLoading,
    setLiked,
    setSaved,
    fetchPosts,
    fetchSavedPosts
  } = useFeedPosts(user);
  
  // Post interactions
  const {
    handleLike,
    handleSave,
    handleShare,
    handleDelete,
    completeShareAction
  } = usePostInteractions(
    user,
    userPosts,
    liked,
    saved,
    setLiked,
    setSaved,
    fetchSavedPosts
  );
  
  // Filter only opportunity posts
  const opportunityPosts = userPosts.filter(post => 
    post.metadata?.type === 'opportunity' || 
    post.type === 'opportunity'
  );
  
  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">Oportunidades de Engenharia</CardTitle>
            <CardDescription>
              Encontre e compartilhe oportunidades para parcerias em projetos de engenharia
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsOpportunityDialogOpen(true)}
            className="gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Publicar oportunidade
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-500">Carregando oportunidades...</p>
            </div>
          ) : opportunityPosts.length > 0 ? (
            <OpportunitiesList
              opportunities={opportunityPosts}
              liked={liked}
              saved={saved}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
              user={user}
            />
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma oportunidade encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Seja o primeiro a publicar uma oportunidade de parceria!
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsOpportunityDialogOpen(true)}>
                  Publicar oportunidade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewOpportunityDialog
        open={isOpportunityDialogOpen}
        onOpenChange={setIsOpportunityDialogOpen}
        onOpportunityCreated={fetchPosts}
      />
    </div>
  );
};

export default Opportunities;
