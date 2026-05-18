'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Background gradient animé */}
      <div className="absolute inset-0 gradient-animated opacity-30 pointer-events-none" />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow radial */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ocean/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <Badge variant="ocean" className="gap-1.5 px-3 py-1 text-xs">
            <Sparkles className="w-3 h-3" />
            Studio IA · Spécialiste PME françaises
          </Badge>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-fade-in"
          style={{ animationDelay: '80ms' }}
        >
          L&apos;IA opérationnelle{' '}
          <span className="bg-gradient-to-r from-ocean-light via-ocean to-ocean-dark bg-clip-text text-transparent">
            pour votre PME.
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: '160ms' }}
        >
          Agents IA sur-mesure, automatisation de processus, intégration dans vos outils existants.
          Des résultats concrets en semaines — pas en mois.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
          style={{ animationDelay: '240ms' }}
        >
          <Link href="/chat">
            <Button variant="gradient" size="xl" className="gap-2 shadow-lg shadow-ocean/20">
              Décrire mon projet
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#offres">
            <Button variant="outline" size="xl">
              Voir nos offres
            </Button>
          </a>
        </div>

        <p
          className="text-xs text-zinc-600 animate-fade-in"
          style={{ animationDelay: '320ms' }}
        >
          Aucune inscription · Confidentiel · Réponse sous 24h
        </p>
      </div>

      {/* Transition bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}
