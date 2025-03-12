
import { useState, useEffect } from "react";
import { ProfileData, Publication, DEMO_PROFILE, DEMO_PUBLICATIONS } from "@/types/profile";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UsePublicProfileReturn {
  profile: ProfileData | null;
  publications: Publication[];
  loading: boolean;
  error: string;
  isFollowing: boolean;
  followLoading: boolean;
  isConnectionAccepted: boolean;
  handleFollowToggle: () => Promise<void>;
}

export const usePublicProfile = (id: string | undefined, user: User | null): UsePublicProfileReturn => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isConnectionAccepted, setIsConnectionAccepted] = useState(false);
  
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
          .select('id, name, username, engineering_type, professional_description, areas_of_expertise, avatar_url, phone')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProfile(data);
        
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
    
    const checkConnectionStatus = () => {
      if (user && id && id !== ":id") {
        const connectionKey = `connection_requests_${id}`;
        const existingRequests = localStorage.getItem(connectionKey);
        
        if (existingRequests) {
          const requests = JSON.parse(existingRequests);
          const acceptedRequest = requests.find((req: any) => 
            req.targetId === user.id && req.status === 'accepted'
          );
          
          const userConnectionKey = `connection_requests_${user.id}`;
          const userRequests = localStorage.getItem(userConnectionKey);
          let userAcceptedRequest = false;
          
          if (userRequests) {
            const parsedUserRequests = JSON.parse(userRequests);
            userAcceptedRequest = parsedUserRequests.some((req: any) => 
              req.targetId === id && req.status === 'accepted'
            );
          }
          
          setIsConnectionAccepted(!!acceptedRequest || userAcceptedRequest);
        }
        
        if (id === "demo") {
          setIsConnectionAccepted(true);
        }
      }
    };
    
    if (id) {
      fetchProfile();
      checkFollowStatus();
      checkConnectionStatus();
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
      } else {
        if (!followingList.includes(profile.id)) {
          followingList.push(profile.id);
        }
      }
      
      localStorage.setItem(`following_${user.id}`, JSON.stringify(followingList));
      setIsFollowing(!isFollowing);
      
    } catch (err: any) {
      console.error("Erro ao seguir/deixar de seguir:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    profile,
    publications,
    loading,
    error,
    isFollowing,
    followLoading,
    isConnectionAccepted,
    handleFollowToggle
  };
};
