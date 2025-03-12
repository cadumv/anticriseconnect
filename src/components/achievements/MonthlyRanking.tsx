import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export const MonthlyRanking = () => {
  const hasEngineers = false; // Set to false since we don't have engineers yet

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Mensal</CardTitle>
        <CardDescription>
          Os 10 engenheiros com mais pontos este mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasEngineers ? (
          <div className="space-y-4">
            {/* This will be populated when we have users */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Trophy className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Ranking em breve</h3>
            <p className="text-gray-500 max-w-md">
              Ainda não temos engenheiros suficientes cadastrados na plataforma para exibir um ranking.
              Seja um dos primeiros a conquistar pontos!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
