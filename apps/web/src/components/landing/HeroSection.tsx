'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

const TRUST_POINTS = [
  { icon: ShieldCheck, text: 'RGPD & NDA systématique' },
  { icon: Clock,       text: 'Premier résultat en < 3 semaines' },
  { icon: CheckCircle, text: '47+ projets livrés pour PME françaises' },
];

// Workflow steps for the animated panel
const WORKFLOW_STEPS = [
  {
    id: 'email',
    label: 'Email entrant',
    sub: 'Demande client reçue',
    icon: '✉',
    color: '#3B82F6',
    delay: 0,
  },
  {
    id: 'analyse',
    label: 'IA analyse',
    sub: 'Intention & priorité détectées',
    icon: '⚡',
    color: '#2563EB',
    delay: 0.8,
  },
  {
    id: 'reponse',
    label: 'Réponse générée',
    sub: 'Personnalisée & envoyée',
    icon: '✦',
    color: '#22C55E',
    delay: 1.6,
  },
  {
    id: 'crm',
    label: 'CRM mis à jour',
    sub: 'Contact & deal synchronisés',
    icon: '↗',
    color: '#3B82F6',
    delay: 2.4,
  },
];

function WorkflowCard({
  step,
  index,
}: {
  step: (typeof WORKFLOW_STEPS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#111827] border border-white/[0.08] relative overflow-hidden"
    >
      {/* Shimmer flow line */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: [0, 0.6, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2.4,
          delay: step.delay,
          repeat: Infinity,
          repeatDelay: 3.2,
          ease: 'easeInOut',
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${step.color}22, transparent)`,
        }}
      />

      {/* Dot */}
      <motion.div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ backgroundColor: `${step.color}18`, color: step.color }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{
          duration: 2,
          delay: step.delay + 0.2,
          repeat: Infinity,
          repeatDelay: 3.2,
          ease: 'easeInOut',
        }}
      >
        {step.icon}
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-none mb-0.5">{step.label}</p>
        <p className="text-xs text-[#8B95A7] leading-none">{step.sub}</p>
      </div>

      {/* Status dot */}
      <motion.div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: step.color }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.6,
          delay: step.delay,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#2563EB]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-[#2563EB]/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/8 text-xs font-medium text-[#3B82F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                IA Consultancy · PME françaises
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.08] tracking-tight text-white">
                L&apos;IA qui automatise{' '}
                <span className="text-gradient-blue">
                  votre PME.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-[#B6C2D1] leading-relaxed max-w-lg"
            >
              Agents IA sur-mesure, automatisation de vos processus, intégration dans vos outils.
              Des résultats concrets en semaines — pas en mois.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(37,99,235,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-[#2563EB] hover:bg-[#3B82F6] text-white text-sm font-semibold rounded-2xl transition-colors duration-200 shadow-lg shadow-[#2563EB]/25 w-full sm:w-auto"
                >
                  Décrire mon projet
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <a href="#offres">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-transparent border border-white/[0.12] hover:border-white/20 hover:bg-white/[0.04] text-[#B6C2D1] hover:text-white text-sm font-semibold rounded-2xl transition-all duration-200 w-full sm:w-auto"
                >
                  Voir nos offres
                </motion.button>
              </a>
            </motion.div>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-col gap-2.5 pt-2"
            >
              {TRUST_POINTS.map((tp, i) => {
                const Icon = tp.icon;
                return (
                  <motion.div
                    key={tp.text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.52 + i * 0.08 }}
                    className="flex items-center gap-2.5 text-sm text-[#8B95A7]"
                  >
                    <Icon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    {tp.text}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT COLUMN — animated workflow */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/[0.08] bg-[#111827]/80 backdrop-blur-sm p-6 lg:p-8 space-y-3">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-[#8B95A7] uppercase tracking-widest mb-1">Workflow IA en action</p>
                  <p className="text-base font-display font-semibold text-white">Traitement automatique</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-xs font-medium text-[#22C55E]">En direct</span>
                </div>
              </div>

              {/* Workflow steps */}
              <div className="space-y-2.5">
                {WORKFLOW_STEPS.map((step, index) => (
                  <WorkflowCard key={step.id} step={step} index={index} />
                ))}
              </div>

              {/* Connector lines between steps */}
              <div className="absolute left-[52px] top-[160px] bottom-[52px] w-px bg-gradient-to-b from-[#2563EB]/30 via-[#2563EB]/15 to-transparent pointer-events-none" />

              {/* Metrics row */}
              <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-4">
                {[
                  { label: 'Temps traitement', value: '< 2s' },
                  { label: 'Taux réussite', value: '99.2%' },
                  { label: 'CRM synchro', value: 'Auto' },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-base font-display font-bold text-white">{m.value}</p>
                    <p className="text-[11px] text-[#8B95A7] mt-0.5 leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient glow behind the card */}
            <div className="absolute -inset-6 bg-[#2563EB]/6 rounded-3xl blur-2xl -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none" />
    </section>
  );
}
