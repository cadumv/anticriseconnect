
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessageSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const MessageSearch = ({ searchTerm, onSearchChange }: MessageSearchProps) => {
  return (
    <div className="relative mt-2">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar conversa..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
