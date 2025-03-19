
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const BackToSearchButton = () => {
  return (
    <Link to="/search">
      <Button variant="ghost" size="sm" className="gap-1">
        <ArrowLeft className="h-4 w-4" /> Voltar para busca
      </Button>
    </Link>
  );
};
