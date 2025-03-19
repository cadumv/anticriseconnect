
import React from "react";
import { Button } from "@/components/ui/button";

export const PostsLoadingState = () => (
  <div className="text-center py-10">
    <div className="animate-pulse text-lg">Carregando publicações...</div>
  </div>
);

export const EmptyPostsState = () => (
  <div className="text-center py-10 border rounded-lg border-dashed">
    <p className="text-gray-500 mb-2">Você ainda não fez nenhuma publicação</p>
    <p className="text-sm text-gray-400">As publicações que você compartilhar aparecerão aqui</p>
    <Button className="mt-4" variant="outline" onClick={() => window.location.href = "/"}>
      Ir para o Feed
    </Button>
  </div>
);
