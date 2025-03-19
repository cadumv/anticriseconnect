
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Achievement } from "@/types/profile";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";
import { AchievementsManager } from "@/services/AchievementsManager";
import { ProfileHeader } from "./ProfilePageHeader";
import { ProfileTabs } from "./ProfileTabs";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [achievementUnlocked, setAchievementUnlocked] = useState<Achievement | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const handleShareAchievement = () => {
    if (achievementUnlocked && user) {
      AchievementsManager.shareAchievement(user.id, achievementUnlocked);
      setShowAchievementPopup(false);
    }
  };

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

  // Load achievements on mount and when user changes
  useEffect(() => {
    if (user) {
      const userAchievements = AchievementsManager.getUserAchievements(user.id);
      setAchievements(userAchievements);

      // Store user name for achievement popups
      if (user.user_metadata?.name) {
        localStorage.setItem(`user_name_${user.id}`, user.user_metadata.name);
      }

      // Check for profile achievement
      const profileAchievement = AchievementsManager.checkProfileCompleted(user);
      if (profileAchievement) {
        setAchievementUnlocked(profileAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }

      // Check for connections achievement
      const connectionsAchievement = AchievementsManager.checkConnectionsAchievement(user.id);
      if (connectionsAchievement) {
        setAchievementUnlocked(connectionsAchievement);
        setShowAchievementPopup(true);
        // Update achievements list immediately
        setAchievements(AchievementsManager.getUserAchievements(user.id));
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Mensagens</span>
        </Button>
      </div>
      
      <ProfileHeader user={user} />
      
      {/* Analytics/Stats Section */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <div className="text-xs text-gray-500">Visualizações do perfil</div>
              <div className="font-semibold mt-1">4</div>
              <div className="text-xs text-gray-500 mt-1">Saiba quem viu seu perfil</div>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500">Impressão das publicações</div>
              <div className="font-semibold mt-1">0</div>
              <div className="text-xs text-gray-500 mt-1">
                Comece uma publicação para aumentar o engajamento
              </div>
              <div className="text-xs text-gray-500 mt-1">Últimos 7 dias</div>
            </div>
          </div>
          <div className="border-t p-2 text-right">
            <Link to="#" className="text-xs text-blue-600 hover:underline">
              Exibir todas as análises →
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* About Section */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-base font-semibold">Sobre</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <PencilLine className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-gray-700">
            {user.user_metadata?.professional_description || "Adicione uma descrição profissional para que outros usuários saibam mais sobre você."}
          </p>
        </CardContent>
      </Card>
      
      {/* Activities Section */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-base font-semibold">Atividades</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              Criar publicação
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-gray-500">
            Você ainda não publicou nada<br />
            As publicações que você compartilhar serão exibidas aqui.
          </p>
          <div className="border-t mt-4 pt-2 text-right">
            <Link to="#" className="text-xs text-blue-600 hover:underline">
              Exibir todas as atividades →
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Experience Section */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-base font-semibold">Experiência</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-lg font-semibold">+</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          {user.user_metadata?.experiences && 
           user.user_metadata.experiences.length > 0 ? (
            <div className="space-y-6">
              {user.user_metadata.experiences.map((exp: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">FSW</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{exp.position || "Cargo não informado"}</h3>
                    <p className="text-sm text-gray-700">{exp.company || "Empresa não informada"}</p>
                    <p className="text-xs text-gray-500">
                      {exp.startMonth && exp.startYear ? formatExperienceDate(exp) : "Período não informado"}
                    </p>
                    {exp.location && <p className="text-xs text-gray-600 mt-0.5">{exp.location}</p>}
                    
                    {/* Skills/Competencies */}
                    {exp.description && (
                      <div className="mt-2">
                        <ul className="list-disc list-inside text-xs text-gray-700 pl-1">
                          <li>{exp.description}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Nenhuma experiência adicionada
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Education Section */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-base font-semibold">Formação acadêmica</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="text-lg font-semibold">+</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-4">
          {user.user_metadata?.education && 
           user.user_metadata.education.length > 0 ? (
            <div className="space-y-6">
              {user.user_metadata.education.map((edu: any, index: number) => (
                <div key={index} className="flex gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-amber-600 font-semibold text-sm">
                      {edu.institution ? edu.institution.substring(0, 3) : "EDU"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{edu.institution || "Instituição não informada"}</h3>
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
          ) : (
            <p className="text-sm text-gray-500">
              Nenhuma formação acadêmica adicionada
            </p>
          )}
        </CardContent>
      </Card>
      
      <ProfileTabs 
        user={user} 
        achievements={achievements}
        onAchievementUnlocked={(achievement) => {
          setAchievementUnlocked(achievement);
          setShowAchievementPopup(true);
          setAchievements(AchievementsManager.getUserAchievements(user.id));
        }}
      />

      {/* Achievement Popup */}
      {achievementUnlocked && showAchievementPopup && (
        <AchievementPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)}
          userName={user.user_metadata?.name || ""}
          achievementTitle={achievementUnlocked.title}
          onShare={handleShareAchievement}
        />
      )}
      
      {/* Chat Drawer Component */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userId={user.id} />
    </div>
  );
};

export default ProfilePage;
