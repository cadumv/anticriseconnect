
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Search, Compass } from "lucide-react";
import { useDiscoveryData } from "./discovery/useDiscoveryData";
import { DiscoverySkeleton } from "./discovery/DiscoverySkeleton";
import { CategoryList } from "./discovery/CategoryList";
import { EngineerList } from "./discovery/EngineerList";
import { SectionContainer } from "./discovery/SectionContainer";

export const Discovery = () => {
  const { categories, featuredEngineers, loading } = useDiscoveryData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Compass className="h-5 w-5 text-blue-500" />
          Descobrir
        </CardTitle>
        <Link to="/search">
          <Button size="sm" variant="ghost" className="h-8 gap-1">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <DiscoverySkeleton />
          ) : (
            <>
              <SectionContainer title="Categorias Populares">
                <CategoryList categories={categories} />
              </SectionContainer>
              
              <SectionContainer title="Engenheiros em Destaque">
                <EngineerList engineers={featuredEngineers} />
              </SectionContainer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
