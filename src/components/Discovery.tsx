
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Engineer {
  id: string;
  name: string;
  engineering_type: string;
  avatar_url?: string | null;
}

interface Category {
  name: string;
  count: number;
}

export const Discovery = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredEngineers, setFeaturedEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCategories();
    fetchFeaturedEngineers();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('engineering_type')
        .not('engineering_type', 'is', null);

      if (error) throw error;

      // Count occurrences of each engineering type
      const counts: { [key: string]: number } = {};
      data.forEach(profile => {
        if (profile.engineering_type) {
          counts[profile.engineering_type] = (counts[profile.engineering_type] || 0) + 1;
        }
      });

      // Convert to array and sort by count
      const categoriesArray = Object.entries(counts).map(([name, count]) => ({
        name,
        count
      }));

      console.log('Categories fetched:', categoriesArray);
      setCategories(categoriesArray.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedEngineers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, engineering_type, avatar_url')
        .not('name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      console.log('Featured engineers fetched:', data);
      setFeaturedEngineers(data || []);
    } catch (error) {
      console.error('Error fetching featured engineers:', error);
      setFeaturedEngineers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Descobrir</CardTitle>
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
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-gray-200 animate-pulse rounded-full w-24"></div>
                ))}
              </div>
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2 mt-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/4 mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="font-medium mb-2">Categorias Populares</h3>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 5).map((category, index) => (
                      <Link key={index} to={`/search?term=${category.name}`}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          {category.name} ({category.count})
                        </Button>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aguardando engenheiros se cadastrarem...</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Engenheiros em Destaque</h3>
                {featuredEngineers.length > 0 ? (
                  <div className="space-y-3">
                    {featuredEngineers.map((engineer) => (
                      <Link key={engineer.id} to={`/profile/${engineer.id}`} className="block">
                        <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={engineer.avatar_url || ""} alt={engineer.name || "Usuário"} />
                            <AvatarFallback>{engineer.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{engineer.name}</p>
                            <p className="text-sm text-gray-500">{engineer.engineering_type}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum engenheiro em destaque ainda...</p>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
