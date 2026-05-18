import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { StatsSection } from '@/components/landing/StatsSection';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'SynTech Studios | Studio IA pour PME françaises',
  description:
    'Agents IA sur-mesure, automatisation de processus et intégration dans vos outils. SynTech accompagne les PME françaises dans leur transformation IA — avec des résultats mesurables en semaines.',
};

export default function Home() {
  return (
    <div className="bg-[#0a0a0f] text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrivacySection />
      <StatsSection />
      <Footer />
    </div>
  );
}
