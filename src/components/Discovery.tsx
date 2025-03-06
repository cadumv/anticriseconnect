
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

export const Discovery = () => {
  const categories = [
    { id: 1, name: "Civil", count: 243 },
    { id: 2, name: "Elétrica", count: 187 },
    { id: 3, name: "Mecânica", count: 156 },
    { id: 4, name: "Ambiental", count: 98 },
    { id: 5, name: "Produção", count: 79 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Descobrir</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Categorias Populares</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button key={category.id} variant="outline" size="sm" className="rounded-full">
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Engenheiros em Destaque</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-500">A</span>
                </div>
                <div>
                  <p className="font-medium">Ana Costa</p>
                  <p className="text-sm text-gray-500">Engenheira Civil</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-500">R</span>
                </div>
                <div>
                  <p className="font-medium">Ricardo Ferreira</p>
                  <p className="text-sm text-gray-500">Engenheiro Eletricista</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-500">J</span>
                </div>
                <div>
                  <p className="font-medium">Juliana Santos</p>
                  <p className="text-sm text-gray-500">Engenheira Ambiental</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
