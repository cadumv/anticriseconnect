
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  initialSearchTerm?: string;
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ initialSearchTerm = "", onSearch, isLoading }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex gap-2">
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
  );
};
