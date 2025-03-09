
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, FileText } from "lucide-react";

export const WeeklyMissions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missões Semanais</CardTitle>
        <CardDescription>
          Complete missões para ganhar pontos e recompensas extras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Fazer 3 novas conexões</h3>
                  <p className="text-sm text-gray-600">Recompensa: 50 pontos</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold">2/3</span>
                <Progress value={66} className="h-1 w-24" />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">Publicar 1 artigo técnico</h3>
                  <p className="text-sm text-gray-600">Recompensa: 100 pontos</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold">0/1</span>
                <Progress value={0} className="h-1 w-24" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
