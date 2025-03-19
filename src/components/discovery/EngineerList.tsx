
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Engineer {
  id: string;
  name: string;
  engineering_type: string;
  avatar_url?: string | null;
}

interface EngineerListProps {
  engineers: Engineer[];
}

export const EngineerList = ({ engineers }: EngineerListProps) => {
  if (engineers.length === 0) {
    return (
      <p className="text-sm text-gray-500">Nenhum engenheiro em destaque ainda...</p>
    );
  }

  return (
    <div className="space-y-3">
      {engineers.map((engineer) => (
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
  );
};
