
import React from "react";
import { Bookmark } from "lucide-react";

export function EmptyPostsState() {
  return (
    <div className="py-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="bg-gray-100 p-3 rounded-full">
          <Bookmark className="h-6 w-6 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhuma publicação salva</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Você ainda não salvou nenhuma publicação. Quando encontrar conteúdos interessantes, 
        clique no ícone de marcador para salvá-los aqui.
      </p>
    </div>
  );
}
