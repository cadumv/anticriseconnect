
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement } from "@/types/profile";
import { ProfilePosts } from "./ProfilePosts";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { Achievements } from "@/components/Achievements";
import { ProfileAccountTab } from "./ProfileAccountTab";

interface ProfileTabsProps {
  user: User;
  achievements: Achievement[];
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const ProfileTabs = ({ user, achievements, onAchievementUnlocked }: ProfileTabsProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto">
        <TabsTrigger value="posts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
          Publicações
        </TabsTrigger>
        <TabsTrigger value="info" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
          Informações
        </TabsTrigger>
        <TabsTrigger value="achievements" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
          Conquistas
        </TabsTrigger>
        <TabsTrigger value="account" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
          Conta
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="pt-4">
        <ProfilePosts user={user} />
      </TabsContent>
      
      <TabsContent value="info" className="pt-4">
        <ProfileInfoTab 
          user={user} 
          isEditingProfile={isEditingProfile}
          setIsEditingProfile={setIsEditingProfile}
          onAchievementUnlocked={onAchievementUnlocked}
        />
      </TabsContent>
      
      <TabsContent value="achievements" className="pt-4">
        <Achievements achievements={achievements} />
      </TabsContent>
      
      <TabsContent value="account" className="pt-4">
        <ProfileAccountTab user={user} />
      </TabsContent>
    </Tabs>
  );
};
