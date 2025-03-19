
import { useState, useEffect } from "react";
import { Publication, DEMO_PUBLICATIONS } from "@/types/profile";

interface UsePublicationsReturn {
  publications: Publication[];
}

export const usePublications = (profileId: string | undefined): UsePublicationsReturn => {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    if (!profileId || profileId === ":id") return;

    // Handle demo profile publications
    if (profileId === "demo") {
      setPublications(DEMO_PUBLICATIONS);
      return;
    }

    // Aqui você pode implementar a lógica para buscar publicações reais
    // Por enquanto, define um array vazio para usuários não-demo
    setPublications([]);
  }, [profileId]);

  return { publications };
};
