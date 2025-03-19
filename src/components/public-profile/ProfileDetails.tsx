
interface ProfileDetailsProps {
  description: string;
  areasOfExpertise?: string[];
}

export const ProfileDetails = ({ 
  description, 
  areasOfExpertise 
}: ProfileDetailsProps) => {
  return (
    <div className="space-y-6 text-left">
      {/* About/Description Section */}
      {description && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-2">Sobre</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}
      
      {/* Areas of Expertise */}
      {areasOfExpertise && areasOfExpertise.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-2">Áreas de atuação</h3>
          <ul className="list-disc list-inside space-y-1">
            {areasOfExpertise.map((area, index) => (
              area && <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
