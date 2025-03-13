
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DefaultPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface DefaultPostsListProps {
  posts: DefaultPost[];
  isLoggedIn: boolean;
}

export function DefaultPostsList({ posts, isLoggedIn }: DefaultPostsListProps) {
  return (
    <>
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
            {post.tags?.map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">Ver detalhes</Button>
            {isLoggedIn && <Button size="sm" variant="ghost">Contatar</Button>}
          </div>
        </div>
      ))}
      
      {!isLoggedIn && (
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
    </>
  );
}
