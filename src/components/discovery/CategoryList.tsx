
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface Category {
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
}

export const CategoryList = ({ categories }: CategoryListProps) => {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-500">Aguardando engenheiros se cadastrarem...</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.slice(0, 5).map((category, index) => (
        <Link key={index} to={`/search?term=${category.name}`}>
          <Button variant="outline" size="sm" className="rounded-full">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            {category.name} ({category.count})
          </Button>
        </Link>
      ))}
    </div>
  );
};
