
import { useState } from "react";
import { MessageSquare, Heart, Share2, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: "photo" | "video" | "text";
  imageUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    authorName: "Allan Assad",
    authorAvatar: "/lovable-uploads/6e9560e5-d1ff-4d44-80ea-38a5efa39e6a.png",
    content: "Finalizando mais um projeto estrutural sustentável! #EngenhariaVerde",
    type: "photo",
    imageUrl: "/lovable-uploads/0b1e82e3-364b-4742-aa7a-113b169d3f60.png",
    tags: ["EngenhariaVerde", "Sustentabilidade"],
    likes: 45,
    comments: 12,
    timestamp: "2h atrás"
  },
  {
    id: "2",
    authorName: "Maria Santos",
    authorAvatar: "/placeholder.svg",
    content: "Nova ponte concluída em São Paulo. Um projeto desafiador que uniu inovação e segurança.",
    type: "text",
    tags: ["Infraestrutura", "Inovação"],
    likes: 89,
    comments: 23,
    timestamp: "5h atrás"
  }
];

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [filter, setFilter] = useState("recentes");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feed de Projetos / Serviços</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "recentes" ? "default" : "outline"}
            onClick={() => setFilter("recentes")}
            size="sm"
          >
            Mais Recentes
          </Button>
          <Button
            variant={filter === "populares" ? "default" : "outline"}
            onClick={() => setFilter("populares")}
            size="sm"
          >
            Mais Populares
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover-scale">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{post.authorName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-semibold">{post.authorName}</h3>
                <span className="text-sm text-muted-foreground">{post.timestamp}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              {post.type === "photo" && post.imageUrl && (
                <div className="relative w-full h-[400px] mb-4 rounded-lg overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-6">
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
