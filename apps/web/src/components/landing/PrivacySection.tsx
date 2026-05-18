import { Zap, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MODES = [
  {
    icon: Zap,
    label: 'Mode Démo',
    badge: 'Gratuit',
    badgeVariant: 'ocean' as const,
    color: 'text-ocean',
    dotColor: 'bg-ocean',
    border: 'hover:border-ocean/40',
    description: "Idéal pour découvrir l'assistant. Session de 30 minutes, données non persistées.",
    features: ['Accès immédiat', 'Sans inscription', 'Session 30 min'],
  },
  {
    icon: Shield,
    label: 'Mode Privé',
    badge: 'Recommandé',
    badgeVariant: 'secondary' as const,
    color: 'text-violet-400',
    dotColor: 'bg-violet-400',
    border: 'hover:border-violet-400/40',
    description: 'Données chiffrées en transit et au repos. Suppression automatique après 2 heures.',
    features: ['Chiffrement AES-256', 'Suppression auto 2h', 'Sans trace'],
  },
  {
    icon: Lock,
    label: 'Mode Confidentiel',
    badge: 'NDA',
    badgeVariant: 'warning' as const,
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    border: 'hover:border-amber-400/40',
    description: 'Accord de confidentialité électronique signé. Données persistantes et protégées juridiquement.',
    features: ['NDA électronique', 'Données persistantes', 'Protection juridique'],
  },
];

const TRUST_BADGES = [
  'RGPD conforme',
  'Données hébergées en UE',
  'EU AI Act conforme',
  'NDA systématique sur tous les projets',
];

export function PrivacySection() {
  return (
    <section id="confiance" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <Badge variant="secondary" className="text-xs">Confiance & Sécurité</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Vos données, notre responsabilité
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            RGPD, EU AI Act, hébergement en UE, NDA systématique. Choisissez le niveau de protection adapté à votre projet.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TRUST_BADGES.map((label) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.label}
                className={cn(
                  'flex flex-col gap-5 p-6 rounded-2xl',
                  'bg-zinc-900/60 border border-zinc-800',
                  'transition-all duration-300 hover:bg-zinc-900',
                  mode.border
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn('p-2.5 rounded-xl bg-zinc-800 w-fit', mode.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={mode.badgeVariant} className="text-[10px]">{mode.badge}</Badge>
                </div>
                <div className="space-y-1.5">
                  <h3 className={cn('font-semibold text-base', mode.color)}>{mode.label}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{mode.description}</p>
                </div>
                <ul className="space-y-1.5 mt-auto">
                  {mode.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className={cn('w-1 h-1 rounded-full flex-shrink-0', mode.dotColor)} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
