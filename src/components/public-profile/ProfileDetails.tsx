
interface ProfileDetailsProps {
  description: string;
  areasOfExpertise: string[];
}

export const ProfileDetails = ({ description, areasOfExpertise }: ProfileDetailsProps) => {
  return (
    <div className="space-y-6 text-left">
      {description && (
        <div>
          <h3 className="text-base font-semibold mb-2">Descrição profissional</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}
      
      {areasOfExpertise && areasOfExpertise.length > 0 && (
        <div>
          <h3 className="text-base font-semibold mb-2">Áreas de atuação</h3>
          <ul className="list-disc list-inside">
            {areasOfExpertise.map((area, index) => (
              area && <li key={index} className="text-gray-700">{area}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
