import { type ReactNode } from 'react';
import Link from 'next/link';
import { Search, Zap, BrainCircuit, RefreshCw, Bot, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
  href?: string;
  accent?: 'ocean' | 'violet' | 'amber' | 'emerald';
}

const ACCENT_CLASSES = {
  ocean:   { icon: 'bg-ocean/10 text-ocean',            border: 'hover:border-ocean/40'        },
  violet:  { icon: 'bg-violet-400/10 text-violet-400',  border: 'hover:border-violet-400/40'   },
  amber:   { icon: 'bg-amber-400/10 text-amber-400',    border: 'hover:border-amber-400/40'    },
  emerald: { icon: 'bg-emerald-400/10 text-emerald-400', border: 'hover:border-emerald-400/40' },
};

function FeatureCard({ icon, title, description, badge, className, href, accent = 'ocean' }: FeatureCardProps) {
  const { icon: iconClass, border } = ACCENT_CLASSES[accent];

  const content = (
    <div className={cn(
      'group relative flex flex-col gap-4 p-6 rounded-2xl h-full',
      'bg-zinc-900/60 border border-zinc-800',
      'transition-all duration-300 hover:bg-zinc-900',
      border,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl w-fit', iconClass)}>{icon}</div>
        {badge && <Badge variant="ocean" className="text-[10px]">{badge}</Badge>}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-white text-base">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
      {href && (
        <span className="mt-auto text-xs text-ocean opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Décrire mon projet <ArrowRight className="w-3 h-3" />
        </span>
      )}
    </div>
  );

  return href ? <Link href={href} className="h-full block">{content}</Link> : content;
}

export function FeaturesSection() {
  return (
    <section id="offres" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <Badge variant="secondary" className="text-xs">Nos offres</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Des résultats mesurables, pas des promesses
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Quatre formules claires pour intégrer l&apos;IA dans votre PME — du premier audit jusqu&apos;au déploiement d&apos;agents autonomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Audit IA"
              description="En une semaine, on cartographie vos processus, identifie les 3 à 5 opportunités IA les plus rentables et vous remet un plan d'action concret avec ROI estimé. La porte d'entrée idéale pour commencer sans risque."
              badge="990 € · 1 semaine"
              href="/chat"
              accent="ocean"
            />
          </div>
          <div>
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Pack Automatisation"
              description="On automatise 3 processus répétitifs dans votre entreprise — emails, documents, rapports, relances. Du temps retrouvé, dès la première semaine de déploiement."
              badge="3 000 – 8 000 €"
              accent="amber"
            />
          </div>
          <div>
            <FeatureCard
              icon={<BrainCircuit className="w-6 h-6" />}
              title="Agent IA Métier"
              description="Un agent IA autonome sur-mesure pour un besoin précis : support client, qualification commerciale, base de connaissance interne, assistant RH..."
              badge="8 000 – 20 000 €"
              accent="violet"
            />
          </div>
          <div>
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Retainer IA"
              description="Votre équipe IA externalisée. Amélioration continue, nouveaux agents, monitoring des performances et support prioritaire chaque mois."
              badge="dès 800 €/mois"
              accent="emerald"
            />
          </div>
          <div>
            <FeatureCard
              icon={<Bot className="w-6 h-6" />}
              title="Pas encore sûr ?"
              description="Décrivez votre activité à notre assistant IA en 15 minutes. Il structure vos enjeux et génère un brief professionnel. Gratuit, sans inscription."
              badge="Gratuit"
              href="/chat"
              accent="ocean"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
