
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Define a type for our ranking user
interface RankingUser {
  id: string;
  name: string;
  points: number;
  avatar_url?: string | null;
}

export const MonthlyRanking = () => {
  const [topUsers, setTopUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 5 users from local storage or eventually from Supabase
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a database query
        // For now, we'll simulate by compiling user data from localStorage
        const allUsers: RankingUser[] = [];
        
        // Iterate through localStorage to find all user achievements
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('user_achievements_')) {
            const userId = key.replace('user_achievements_', '');
            const achievementsJson = localStorage.getItem(key);
            
            if (achievementsJson) {
              const achievements = JSON.parse(achievementsJson);
              const completedAchievements = achievements.filter((a: any) => a.completed);
              const totalPoints = completedAchievements.reduce((sum: number, ach: any) => sum + ach.points, 0);
              
              // Try to get user metadata
              let userName = "Usuário";
              try {
                const { data } = await supabase
                  .from('profiles')
                  .select('full_name, avatar_url')
                  .eq('id', userId)
                  .single();
                
                if (data) {
                  userName = data.full_name || "Engenheiro";
                }
              } catch (error) {
                // If we can't get the user from Supabase, use a default name
                // In practice this would be properly handled
              }
              
              if (totalPoints > 0) {
                allUsers.push({
                  id: userId,
                  name: userName,
                  points: totalPoints,
                  avatar_url: null
                });
              }
            }
          }
        }
        
        // Sort users by points (descending) and take top 5
        const sortedUsers = allUsers
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);
        
        setTopUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopUsers();
    
    // Set up an interval to refresh the data periodically
    const intervalId = setInterval(fetchTopUsers, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const hasEngineers = topUsers.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Mensal</CardTitle>
        <CardDescription>
          Os 5 engenheiros com mais pontos este mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4 w-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 h-5 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : hasEngineers ? (
          <div className="space-y-4">
            {topUsers.map((user, idx) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-3 p-3 rounded-lg ${idx === 0 ? 'bg-blue-50 border border-blue-100' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold 
                  ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    idx === 1 ? 'bg-gray-100 text-gray-700' : 
                    idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                  {idx + 1}
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full">
                  {user.avatar_url && (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{user.name}</h3>
                </div>
                <div>
                  <Badge variant="outline" className="bg-gray-50">
                    {user.points} pts
                  </Badge>
                </div>
              </div>
            ))}
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
