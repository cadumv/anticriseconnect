
import { UserCard } from "./UserCard";

interface Engineer {
  id: string;
  name: string;
  username?: string;
  engineering_type: string;
  professional_description: string;
  avatar_url: string | null;
}

interface SearchResultsProps {
  users: Engineer[];
  isLoading: boolean;
  searchPerformed: boolean;
  onUserClick: (id: string) => void;
}

export const SearchResults = ({ 
  users, 
  isLoading, 
  searchPerformed,
  onUserClick 
}: SearchResultsProps) => {
  if (isLoading) {
    return <p className="text-center py-4 text-muted-foreground">Carregando usuários...</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        {searchPerformed 
          ? "Nenhum profissional encontrado com esse termo de busca." 
          : "Nenhum profissional encontrado. Comece a digitar para buscar."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((engineer) => (
        <UserCard
          key={engineer.id}
          id={engineer.id}
          name={engineer.name}
          username={engineer.username}
          engineering_type={engineer.engineering_type}
          professional_description={engineer.professional_description}
          avatar_url={engineer.avatar_url}
          onClick={onUserClick}
        />
      ))}
    </div>
  );
};
