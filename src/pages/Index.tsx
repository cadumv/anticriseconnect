
import { ProfileHeader } from "@/components/ProfileHeader";
import { Achievements } from "@/components/Achievements";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <ProfileHeader />
        <Achievements />
      </main>
    </div>
  );
};

export default Index;
