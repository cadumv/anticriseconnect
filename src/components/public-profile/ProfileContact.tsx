
import { Phone } from "lucide-react";

interface ProfileContactProps {
  phone: string;
}

export const ProfileContact = ({ phone }: ProfileContactProps) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Contato</h3>
      <div className="space-y-2">
        {phone && (
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="h-4 w-4" /> {phone}
          </div>
        )}
      </div>
    </div>
  );
};
