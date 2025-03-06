
import { ProfileHeader } from "@/components/ProfileHeader";
import { Achievements } from "@/components/Achievements";
import { Feed } from "@/components/Feed";
import { Discovery } from "@/components/Discovery";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-8">
            <ProfileHeader />
            <Achievements />
            <Feed />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <Discovery />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
