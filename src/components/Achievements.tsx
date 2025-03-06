
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export const Achievements = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Conquistas</CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-500">🏆</span>
              </div>
              <span className="text-sm text-center">Perfil Completo</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400">🔄</span>
              </div>
              <span className="text-sm text-center">Primeira Parceria</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400">⭐</span>
              </div>
              <span className="text-sm text-center">5 Avaliações</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400">📝</span>
              </div>
              <span className="text-sm text-center">Publicar Artigo</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Faça login para ver suas conquistas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
