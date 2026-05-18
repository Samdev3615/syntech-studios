import { MessageSquare, FileText, Code2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Décrivez votre projet',
    description: "Via notre assistant IA en 15 minutes. On reçoit un brief structuré de votre activité, vos enjeux et vos objectifs.",
  },
  {
    icon: FileText,
    title: 'Audit & Proposition',
    description: "On analyse vos processus, identifie les leviers IA les plus rentables et vous présente un plan concret avec chiffrage et ROI estimé.",
  },
  {
    icon: Code2,
    title: 'Développement agile',
    description: 'Livraisons toutes les deux semaines. Vous voyez les résultats rapidement et gardez le contrôle à chaque étape.',
  },
  {
    icon: TrendingUp,
    title: 'Suivi & Optimisation',
    description: 'Monitoring continu, ajustements, nouveaux agents. Votre IA évolue avec votre entreprise.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="processus" className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Comment on travaille
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Un processus clair, des livrables concrets à chaque étape, aucune surprise.
          </p>
        </div>

        <div className="relative">
          {/* Ligne de connexion desktop */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px border-t border-dashed border-zinc-700" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-center text-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-ocean shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      'absolute -top-2.5 -right-2.5 text-[10px] font-bold',
                      'w-5 h-5 rounded-full flex items-center justify-center',
                      'bg-gradient-to-br from-ocean-light to-ocean text-white shadow-sm'
                    )}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white text-lg">{step.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
