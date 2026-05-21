'use client';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrivacyMode } from '@/lib/api';

interface Mode {
  id: PrivacyMode;
  icon: ReactNode;
  label: string;
  subtitle: string;
  features: string[];
  badge?: string;
  color: string;
  bg: string;
  border: string;
}

const MODES: Mode[] = [
  {
    id: 'demo',
    icon: <Zap className="w-6 h-6" />,
    label: 'Mode Démo',
    subtitle: 'Testez sans engagement',
    features: ['Session de 30 minutes', 'Données non sauvegardées', 'Toutes les fonctionnalités'],
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20 hover:border-sky-400/60',
  },
  {
    id: 'private',
    icon: <Shield className="w-6 h-6" />,
    label: 'Mode Privé',
    subtitle: 'Protection maximale',
    features: ['Chiffrement AES-256', 'Suppression auto après 2h', 'Hébergement EU'],
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20 hover:border-violet-400/60',
  },
  {
    id: 'nda',
    icon: <Lock className="w-6 h-6" />,
    label: 'Confidentiel NDA',
    subtitle: 'Protection juridique totale',
    features: ['NDA signé électroniquement', 'Données persistantes & sécurisées', 'Couverture juridique'],
    badge: 'Recommandé',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-400/60',
  },
];

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

interface ModeSelectorProps {
  onSelect: (_mode: PrivacyMode) => void;
  isLoading: boolean;
}

export function ModeSelector({ onSelect, isLoading }: ModeSelectorProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-full px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-12 space-y-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
          Assistant IA disponible
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight">
          Cadrage de projet<br />
          <span className="text-brand-blue">en 15 minutes</span>
        </h1>
        <p className="text-brand-text-2 max-w-md mx-auto text-sm leading-relaxed">
          Décrivez votre idée à notre IA et obtenez un cahier des charges structuré,
          prêt à transmettre à notre équipe.
        </p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl relative z-10"
      >
        {MODES.map((mode) => (
          <motion.button
            key={mode.id}
            variants={cardVariants}
            onClick={() => !isLoading && onSelect(mode.id)}
            disabled={isLoading}
            whileHover={!isLoading ? { y: -6, scale: 1.02 } : undefined}
            whileTap={!isLoading ? { scale: 0.97 } : undefined}
            className={cn(
              'group relative flex flex-col gap-5 p-6 rounded-2xl text-left',
              'bg-brand-bg-3 border transition-all duration-300',
              'shadow-lg hover:shadow-2xl',
              mode.border,
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Badge */}
            {mode.badge && (
              <span className={cn(
                'absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                mode.bg, mode.color, 'border border-current/30'
              )}>
                {mode.badge}
              </span>
            )}

            {/* Icon */}
            <div className={cn(
              'p-3 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110',
              mode.bg, mode.color
            )}>
              {mode.icon}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-base leading-tight">{mode.label}</h3>
              <p className={cn('text-xs font-medium', mode.color)}>{mode.subtitle}</p>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 flex-1">
              {mode.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-brand-text-2 text-xs">
                  <Check className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', mode.color)} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className={cn(
              'flex items-center gap-1.5 text-xs font-semibold transition-all duration-200',
              'group-hover:translate-x-1',
              mode.color
            )}>
              Choisir ce mode
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-10 text-[11px] text-brand-text-3 relative z-10"
      >
        {['RGPD conforme', 'Hébergement EU', 'Chiffrement AES-256', 'NDA disponible'].map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            <span className="text-brand-success">●</span>
            {badge}
          </span>
        ))}
      </motion.div>

      {isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-sm text-brand-text-3 animate-pulse"
        >
          Initialisation de la session…
        </motion.p>
      )}
    </div>
  );
}
