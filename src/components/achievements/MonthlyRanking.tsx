
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MonthlyRanking = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Mensal</CardTitle>
        <CardDescription>
          Os 10 engenheiros com mais pontos este mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { position: 1, name: "Carlos Silva", points: 2450, avatar: null },
            { position: 2, name: "Mariana Costa", points: 2120, avatar: null },
            { position: 3, name: "João", points: 1850, avatar: null },
            { position: 4, name: "Ana Oliveira", points: 1620, avatar: null },
            { position: 5, name: "Pedro Santos", points: 1580, avatar: null }
          ].map((engineer, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-3 rounded-lg ${idx === 2 ? 'bg-blue-50 border border-blue-100' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold 
                ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  idx === 1 ? 'bg-gray-100 text-gray-700' : 
                  idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                {engineer.position}
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium">{engineer.name}</h3>
              </div>
              <div>
                <Badge variant="outline" className="bg-gray-50">
                  {engineer.points} pts
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
