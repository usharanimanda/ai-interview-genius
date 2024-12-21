import { VideoInterview } from "@/components/VideoInterview";
import { RecruitmentOfficer } from "@/components/RecruitmentOfficer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Interview Platform</h1>
        <p className="text-xl text-gray-600">Experience the future of recruitment</p>
      </div>
      <div className="container mx-auto space-y-6">
        <VideoInterview />
        <RecruitmentOfficer />
      </div>
    </div>
  );
};

export default Index;