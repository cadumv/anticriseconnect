
import { Trophy, Award, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Achievements = () => {
  const achievements = [
    {
      icon: Trophy,
      title: "Top Engenheiro",
      description: "Entre os 10 mais ativos",
      color: "text-yellow-500"
    },
    {
      icon: Award,
      title: "Parcerias de Sucesso",
      description: "5 projetos concluídos",
      color: "text-blue-500"
    },
    {
      icon: Star,
      title: "Reconhecimento",
      description: "100+ recomendações",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {achievements.map((achievement, index) => (
        <Card 
          key={index}
          className="p-4 hover-scale glass-effect"
        >
          <div className="flex items-center gap-3">
            <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
            <div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
