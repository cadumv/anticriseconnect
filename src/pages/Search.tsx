
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, User, Tag, AtSign } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Engineer {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  professional_description: string;
  avatar_url: string | null;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Engineer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialUsers, setInitialUsers] = useState<Engineer[]>([]);
  const navigate = useNavigate();

  // Load initial users when component mounts
  useEffect(() => {
    fetchInitialUsers();
  }, []);

  // Fetch some initial users to display
  const fetchInitialUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, engineering_type, professional_description, avatar_url')
        .not('name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      console.log('Initial users loaded:', data);
      setInitialUsers(data || []);
    } catch (error) {
      console.error("Error fetching initial users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time search as user types
  useEffect(() => {
    const handleSearchDebounced = setTimeout(() => {
      if (searchTerm && searchTerm.length >= 2) {
        handleSearch();
      } else if (searchTerm.length === 0) {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handleSearchDebounced);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const cleanedSearchTerm = searchTerm.startsWith('@') 
        ? searchTerm.substring(1) 
        : searchTerm;
      
      // Build the query
      let query = supabase
        .from('profiles')
        .select('id, name, username, engineering_type, professional_description, avatar_url');
      
      // Different search based on if it's a username search (with @) or general search
      if (searchTerm.startsWith('@')) {
        query = query.ilike('username', `%${cleanedSearchTerm}%`);
      } else {
        // Use OR to search across multiple fields
        query = query.or(`name.ilike.%${searchTerm}%,engineering_type.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }
      
      // Only get profiles with a name (to filter out incomplete profiles)
      const { data, error } = await query.not('name', 'is', null);
      
      if (error) throw error;
      
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleProfileClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

  // Determine which users to display
  const usersToDisplay = searchTerm.length >= 2 ? searchResults : initialUsers;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buscar Profissionais</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Buscar Profissionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Digite o nome, username (@) ou tipo de engenharia..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <SearchIcon className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Carregando usuários...</p>
            ) : usersToDisplay.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {searchTerm.length >= 2 
                  ? "Nenhum profissional encontrado com esse termo de busca." 
                  : "Nenhum profissional encontrado. Comece a digitar para buscar."}
              </p>
            ) : (
              usersToDisplay.map((engineer) => (
                <Card 
                  key={engineer.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors" 
                  onClick={() => handleProfileClick(engineer.id)}
                >
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
                          {engineer.username && (
                            <span className="text-gray-500 text-sm flex items-center">
                              <AtSign className="h-3 w-3 mr-0.5" />
                              {engineer.username}
                            </span>
                          )}
                          {engineer.engineering_type && (
                            <Badge variant="outline" className="ml-2">
                              <Tag className="mr-1 h-3 w-3" />
                              {engineer.engineering_type}
                            </Badge>
                          )}
                        </div>
                        {engineer.professional_description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {engineer.professional_description}
                          </p>
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
