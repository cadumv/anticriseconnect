
import { Publication } from "@/types/profile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublicationsListProps {
  publications: Publication[];
}

export const PublicationsList = ({ publications }: PublicationsListProps) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Publicações</h2>
      </CardHeader>
      <CardContent>
        {publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((publication) => (
              <div key={publication.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-lg">{publication.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{publication.snippet}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Publicado em {publication.date}</span>
                  <Button variant="link" size="sm" className="p-0">Ler mais</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma publicação encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
