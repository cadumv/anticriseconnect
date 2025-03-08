import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, User, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface Engineer {
  id: string;
  name: string;
  engineering_type: string;
  professional_description: string;
  avatar_url: string | null;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Engineer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, engineering_type, professional_description, avatar_url')
        .or(`name.ilike.%${searchTerm}%,engineering_type.ilike.%${searchTerm}%,professional_description.ilike.%${searchTerm}%`);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buscar Profissionais</h1>
        <Link to="/profile/demo">
          <Button variant="outline" className="gap-1">
            <User className="h-4 w-4" />
            Ver Perfil Demo
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Buscar Profissionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Nome, tipo de engenharia ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <SearchIcon className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          <div className="space-y-4">
            {searchResults.length === 0 && searchTerm && !isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Nenhum profissional encontrado com esse termo de busca.</p>
            ) : (
              searchResults.map((engineer) => (
                <Card key={engineer.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate(`/profile/${engineer.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                        {engineer.avatar_url ? (
                          <img 
                            src={engineer.avatar_url} 
                            alt={`Foto de ${engineer.name}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{engineer.name}</h3>
                          {engineer.engineering_type && (
                            <Badge variant="outline" className="ml-2">
                              <Tag className="mr-1 h-3 w-3" />
                              {engineer.engineering_type}
                            </Badge>
                          )}
                        </div>
                        {engineer.professional_description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{engineer.professional_description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Search;
