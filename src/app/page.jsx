import Header from '@/components/ui/Header';
import PublicMatchList from '@/components/match/PublicMatchList';
import HeroSection from '@/components/match/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAdmin />
      <HeroSection />
      <PublicMatchList />
    </div>
  );
}
