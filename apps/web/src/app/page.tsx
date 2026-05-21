import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'SynTech Studios | L\'IA qui automatise votre PME',
  description:
    'Agents IA sur-mesure, automatisation de processus et intégration dans vos outils. SynTech Studios accompagne les PME françaises dans leur transformation IA — avec des résultats mesurables en semaines.',
};

export default function Home() {
  return (
    <div className="bg-[#0B1220] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrivacySection />
      <StatsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
