
import { Publication } from "@/types/profile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Calendar, Eye } from "lucide-react";

interface PublicationsListProps {
  publications: Publication[];
}

export const PublicationsList = ({ publications }: PublicationsListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Publicações</h2>
        </div>
        
        {publications.length > 0 && (
          <Badge variant="outline" className="px-2 py-1">
            {publications.length} {publications.length === 1 ? 'publicação' : 'publicações'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((publication) => (
              <div 
                key={publication.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-medium text-lg text-blue-700">{publication.title}</h3>
                <p className="mt-2 text-gray-600">{publication.snippet}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> 
                      {publication.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> 
                      5 min de leitura
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> 
                      127 visualizações
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                    Ler mais
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg border-dashed">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">Nenhuma publicação encontrada</p>
            <p className="text-sm text-gray-400">Publicações técnicas aparecem aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
