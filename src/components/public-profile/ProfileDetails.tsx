
interface ProfileDetailsProps {
  description: string;
  areasOfExpertise: string[];
  education?: any[];
  experiences?: any[];
  interests?: string[];
}

export const ProfileDetails = ({ 
  description, 
  areasOfExpertise,
  education,
  experiences,
  interests
}: ProfileDetailsProps) => {
  // Format date helper function
  const formatDate = (month: string, year: string) => {
    if (!month || !year) return "";
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} de ${year}`;
  };

  const formatExperienceDate = (experience: any) => {
    const startDate = formatDate(experience.startMonth, experience.startYear);
    if (experience.current) {
      return `${startDate} - Atual`;
    }
    const endDate = formatDate(experience.endMonth, experience.endYear);
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* About/Description Section */}
      {description && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-2">Sobre</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}
      
      {/* Experience Section */}
      {experiences && experiences.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-3">Experiência</h3>
          <div className="space-y-5">
            {experiences.map((exp, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">
                    {exp.company ? exp.company.substring(0, 3) : "EXP"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{exp.position || "Cargo não informado"}</h4>
                  <p className="text-sm text-gray-700">{exp.company || "Empresa não informada"}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startMonth && exp.startYear ? formatExperienceDate(exp) : "Período não informado"}
                  </p>
                  {exp.location && <p className="text-xs text-gray-600 mt-0.5">{exp.location}</p>}
                  {exp.description && <p className="mt-1 text-xs text-gray-700">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-3">Formação acadêmica</h3>
          <div className="space-y-5">
            {education.map((edu, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-amber-600 font-semibold text-sm">
                    {edu.institution ? edu.institution.substring(0, 3) : "EDU"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{edu.institution || "Instituição não informada"}</h4>
                  <p className="text-sm text-gray-700">
                    {edu.degree && edu.fieldOfStudy ? `${edu.degree} em ${edu.fieldOfStudy}` : 
                     edu.degree ? edu.degree : 
                     edu.fieldOfStudy ? edu.fieldOfStudy : "Curso não informado"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {edu.startYear && edu.endYear ? 
                      `${edu.startYear} - ${edu.endYear === "Atual" ? "Atual" : edu.endYear}` : 
                      "Período não informado"}
                  </p>
                  {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
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
      
      {/* Interests */}
      {interests && interests.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm">
          <h3 className="text-base font-semibold mb-2">Interesses</h3>
          <ul className="list-disc list-inside space-y-1">
            {interests.map((interest, index) => (
              interest && <li key={index} className="text-gray-700">{interest}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
