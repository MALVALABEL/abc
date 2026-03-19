import Header from '@/components/ui/Header';
import VenueMatchList from '@/components/match/VenueMatchList';
import HeroSection from '@/components/match/HeroSection';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAdmin />
      <HeroSection />
      <VenueMatchList />
      <Footer />
    </div>
  );
}
