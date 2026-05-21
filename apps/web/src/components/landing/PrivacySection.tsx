'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Globe, Lock, FileCheck, Server } from 'lucide-react';

const TRUST_CARDS = [
  {
    icon: Shield,
    title: 'RGPD conforme',
    description:
      'Conformité totale au Règlement Général sur la Protection des Données. Vos données personnelles et celles de vos clients sont traitées dans le strict respect des réglementations européennes.',
    color: '#3B82F6',
  },
  {
    icon: Globe,
    title: 'Hébergement UE',
    description:
      'Toutes vos données restent sur le sol européen. Pas de transfert hors UE. Infrastructure hébergée en France et Allemagne pour une souveraineté numérique totale.',
    color: '#8B5CF6',
  },
  {
    icon: Lock,
    title: 'Données chiffrées',
    description:
      "Chiffrement AES-256 au repos et TLS 1.3 en transit. Vos données ne peuvent être lues par personne, même en cas d'interception — protection cryptographique de niveau bancaire.",
    color: '#F59E0B',
  },
  {
    icon: FileCheck,
    title: 'Accord NDA',
    description:
      'Accord de confidentialité signé systématiquement avant tout échange. Protection juridique de vos informations stratégiques, processus métier et données propriétaires.',
    color: '#22C55E',
  },
  {
    icon: Server,
    title: 'Environnement sécurisé',
    description:
      "Infrastructure iso-tenante, accès restreint par rôle, logs d'audit complets. Chaque projet bénéficie d'un environnement isolé — zéro contamination entre clients.",
    color: '#06B6D4',
  },
];

export function PrivacySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="confiance" ref={ref} className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#3B82F6] mb-4">
            Confiance & Sécurité
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight max-w-lg">
              Vos données,{' '}
              <span className="text-gradient-blue">notre responsabilité</span>
            </h2>
            <p className="text-[#8B95A7] max-w-sm lg:text-right leading-relaxed">
              RGPD, EU AI Act, hébergement en UE, NDA systématique. La confiance n&apos;est pas une option — c&apos;est notre engagement fondamental.
            </p>
          </div>
        </motion.div>

        {/* Cards grid: 2 + 3 */}
        <div className="space-y-4">
          {/* Row 1 — 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUST_CARDS.slice(0, 2).map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4 p-7 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-white/[0.14] hover:bg-[#172033] transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${card.color}14`, color: card.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-[#8B95A7] leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Row 2 — 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRUST_CARDS.slice(2).map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: (index + 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4 p-7 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-white/[0.14] hover:bg-[#172033] transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${card.color}14`, color: card.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-[#8B95A7] leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom compliance row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {['RGPD conforme', 'EU AI Act', 'Données hébergées en UE', 'NDA systématique', 'ISO 27001 best practices'].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#B6C2D1] bg-[#111827] border border-white/[0.08]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
