
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Edit3, Plus, Eye, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const [postCount, setPostCount] = useState(0);

  // Fetch user post count
  useEffect(() => {
    const fetchPostCount = async () => {
      if (!user) return;
      
      try {
        const { count, error } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        setPostCount(count || 0);
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };
    
    fetchPostCount();
  }, [user]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-36 bg-gradient-to-r from-blue-50 to-indigo-100 relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Editar capa
        </Button>
      </div>
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row">
          <div className="relative -top-16 mb-2 sm:-top-16 sm:mb-0 sm:mr-4">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-500">
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="sm:pt-4 sm:flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="-mt-12 sm:mt-0">
                <h2 className="text-2xl font-bold">{user?.user_metadata?.name || "Usuário"}</h2>
                {user?.user_metadata?.professional_description && (
                  <p className="text-gray-600 mt-1">{user.user_metadata.professional_description}</p>
                )}
                <p className="text-gray-500 mt-1">
                  {user?.user_metadata?.engineering_type || "Engenharia"} • {" "}
                  <button className="text-blue-600 hover:underline">Informações de contato</button>
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar seção
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">4 visualizações do perfil</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{postCount} publicações</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
