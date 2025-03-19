
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearchEngineers } from "@/hooks/useSearchEngineers";

const Search = () => {
  const navigate = useNavigate();
  const { 
    searchTerm, 
    setSearchTerm,
    isLoading, 
    handleSearch, 
    usersToDisplay,
    searchPerformed
  } = useSearchEngineers();

  const handleProfileClick = (id: string) => {
    navigate(`/profile/${id}`);
  };

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
          <div className="mb-6">
            <SearchBar 
              initialSearchTerm={searchTerm}
              onSearch={(term) => {
                setSearchTerm(term);
                handleSearch();
              }}
              isLoading={isLoading}
            />
          </div>

          <SearchResults 
            users={usersToDisplay}
            isLoading={isLoading}
            searchPerformed={searchPerformed}
            onUserClick={handleProfileClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Search;
