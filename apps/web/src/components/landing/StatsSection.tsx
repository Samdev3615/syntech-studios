import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { value: '90 j',     label: 'Pour un premier ROI mesurable' },
  { value: '100%',     label: 'RGPD & EU AI Act conforme' },
  { value: '< 1 sem',  label: 'Pour recevoir votre Audit IA' },
  { value: 'France',   label: 'Équipe et données hébergées en UE' },
];

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center space-y-1.5">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ocean-light to-ocean bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 gradient-animated opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean/10 via-transparent to-ocean/10" />
          <div className="absolute inset-0 border border-ocean/20 rounded-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 px-8 py-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-xl leading-tight">
              Prêt à prendre de l&apos;avance sur{' '}
              <span className="bg-gradient-to-r from-ocean-light to-ocean bg-clip-text text-transparent">
                vos concurrents
              </span>
              &nbsp;?
            </h2>
            <p className="text-zinc-400 max-w-md">
              Décrivez votre projet en 15 minutes. On revient vers vous sous 24h avec une proposition concrète.
            </p>
            <Link href="/chat">
              <Button variant="gradient" size="xl" className="gap-2 shadow-xl shadow-ocean/25">
                Décrire mon projet
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-600">
              Aucune inscription · Confidentiel · Réponse sous 24h
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
