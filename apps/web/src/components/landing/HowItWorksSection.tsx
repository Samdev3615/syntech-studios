'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, FileSearch, Code2, TrendingUp, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Cadrage rapide',
    description:
      "Via notre assistant IA en 15 minutes. On reçoit un brief structuré de votre activité, vos enjeux et vos objectifs — sans réunion, sans friction.",
    color: '#3B82F6',
  },
  {
    icon: FileSearch,
    number: '02',
    title: 'Audit & Proposition',
    description:
      "On analyse vos processus, identifie les leviers IA les plus rentables et vous présente un plan concret avec chiffrage et ROI estimé sous 5 jours.",
    color: '#8B5CF6',
  },
  {
    icon: Code2,
    number: '03',
    title: 'Développement agile',
    description:
      'Livraisons toutes les deux semaines. Vous voyez les résultats rapidement et gardez le contrôle à chaque étape du déploiement.',
    color: '#F59E0B',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Déploiement & Formation',
    description:
      "Mise en production dans vos outils existants. Formation de vos équipes incluse. Vos collaborateurs adoptent l'IA naturellement.",
    color: '#22C55E',
  },
  {
    icon: TrendingUp,
    number: '05',
    title: 'Suivi & Optimisation',
    description:
      'Monitoring continu, ajustements basés sur les données, nouveaux agents. Votre IA évolue avec votre entreprise et votre secteur.',
    color: '#3B82F6',
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="processus" ref={ref} className="py-28 px-6 bg-[#111827]/40">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#3B82F6] mb-4">
            Processus
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight max-w-lg">
              Comment on travaille,{' '}
              <span className="text-gradient-blue">étape par étape</span>
            </h2>
            <p className="text-[#8B95A7] max-w-sm lg:text-right leading-relaxed">
              Un processus clair, des livrables concrets à chaque étape. Aucune surprise, aucun flou.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical timeline line (desktop) */}
          <div className="hidden lg:block absolute left-[38px] top-0 bottom-0 w-px bg-gradient-to-b from-[#2563EB]/40 via-[#2563EB]/20 to-transparent" />

          <div className="space-y-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex gap-6 lg:gap-8 p-6 lg:p-7 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-white/[0.14] hover:bg-[#172033] transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: `${step.color}14`,
                        color: step.color,
                        boxShadow: `0 0 0 1px ${step.color}22`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tabular-nums" style={{ color: step.color }}>
                        {step.number}
                      </span>
                      <h3 className="font-display text-base font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-[#8B95A7] leading-relaxed max-w-2xl">{step.description}</p>
                  </div>

                  {/* Step number large (background decoration) */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-5xl font-display font-black text-white/[0.03] select-none">
                      {step.number}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
