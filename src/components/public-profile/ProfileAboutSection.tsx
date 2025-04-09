
import { Card, CardContent } from "@/components/ui/card";

interface ProfileAboutSectionProps {
  description?: string;
  areasOfExpertise?: string[];
}

export const ProfileAboutSection = ({ 
  description, 
  areasOfExpertise 
}: ProfileAboutSectionProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6 text-left">
          {description && (
            <div>
              <h3 className="text-base font-semibold mb-3">Sobre</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          )}
          
          {areasOfExpertise && areasOfExpertise.length > 0 && (
            <div>
              <h3 className="text-base font-semibold mb-3">Áreas de atuação</h3>
              <ul className="list-disc list-inside space-y-2">
                {areasOfExpertise.map((area, index) => (
                  area && <li key={index} className="text-gray-700">{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
