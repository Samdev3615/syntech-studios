'use client';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrivacyMode } from '@/lib/api';

interface Mode {
  id: PrivacyMode;
  icon: ReactNode;
  label: string;
  description: string;
  color: string;
  border: string;
}

const MODES: Mode[] = [
  {
    id: 'demo',
    icon: <Zap className="w-6 h-6" />,
    label: 'Mode Démo',
    description: 'Idéal pour découvrir. Données non sauvegardées, session de 30 min.',
    color: 'text-ocean',
    border: 'hover:border-ocean/50',
  },
  {
    id: 'private',
    icon: <Shield className="w-6 h-6" />,
    label: 'Mode Privé',
    description: 'Données chiffrées et supprimées automatiquement après 2 heures.',
    color: 'text-violet-400',
    border: 'hover:border-violet-400/50',
  },
  {
    id: 'nda',
    icon: <Lock className="w-6 h-6" />,
    label: 'Mode Confidentiel',
    description: 'NDA électronique signé. Données persistantes et protégées juridiquement.',
    color: 'text-amber-400',
    border: 'hover:border-amber-400/50',
  },
];

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const headerVariants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

interface ModeSelectorProps {
  onSelect: (_mode: PrivacyMode) => void;
  isLoading: boolean;
}

export function ModeSelector({ onSelect, isLoading }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className="text-center mb-10 space-y-3"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-ocean-light via-ocean to-ocean-dark bg-clip-text text-transparent">
          Assistant de Cadrage Projet
        </h1>
        <p className="text-zinc-400 max-w-md">
          Décrivez votre projet à notre IA et obtenez un cahier des charges structuré en quelques minutes.
        </p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {MODES.map((mode) => (
          <motion.button
            key={mode.id}
            variants={cardVariants}
            onClick={() => !isLoading && onSelect(mode.id)}
            disabled={isLoading}
            whileHover={!isLoading ? { y: -2 } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
            className={cn(
              'group flex flex-col gap-4 p-6 rounded-xl text-left',
              'bg-zinc-900/60 border border-zinc-800',
              'transition-colors duration-200',
              'hover:bg-zinc-900',
              mode.border,
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className={cn('p-2 rounded-lg bg-zinc-800 w-fit', mode.color)}>
              {mode.icon}
            </div>
            <div className="space-y-1">
              <h3 className={cn('font-semibold text-sm', mode.color)}>{mode.label}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{mode.description}</p>
            </div>
            <span className={cn(
              'text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity',
              mode.color
            )}>
              Commencer →
            </span>
          </motion.button>
        ))}
      </motion.div>

      {isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-sm text-zinc-500 animate-pulse"
        >
          Initialisation de la session…
        </motion.p>
      )}
    </div>
  );
}
