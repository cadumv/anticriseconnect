
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Feed = () => {
  const { user } = useAuth();
  
  const posts = [
    {
      id: 1,
      title: "Engenheiro Civil busca parceria para projeto residencial",
      author: "Carlos Silva",
      date: "Há 2 dias",
      excerpt: "Busco engenheiro eletricista para colaboração em projeto residencial de alto padrão na zona sul.",
      tags: ["Civil", "Residencial", "Parceria"]
    },
    {
      id: 2,
      title: "Vaga para engenheiro mecânico em projeto industrial",
      author: "Marina Oliveira",
      date: "Há 5 dias",
      excerpt: "Empresa de grande porte busca engenheiro mecânico com experiência em projetos industriais.",
      tags: ["Mecânica", "Industrial", "Vaga"]
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Feed de Projetos</CardTitle>
        {user && (
          <Button size="sm" variant="outline">
            Novo Post
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {posts.map((post) => (
          <div key={post.id} className="mb-6 pb-6 border-b last:border-0">
            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
            <div className="flex gap-2 text-sm text-gray-500 mb-2">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">Ver detalhes</Button>
              {user && <Button size="sm" variant="ghost">Contatar</Button>}
            </div>
          </div>
        ))}
        
        {!user && (
          <div className="text-center py-4 mt-4 border-t">
            <p className="text-gray-500 mb-4">Faça login para ver mais projetos e interagir com outros engenheiros</p>
            <div className="flex gap-2 justify-center">
              <Link to="/login">
                <Button size="sm">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline">Cadastrar</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
