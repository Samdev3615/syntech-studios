'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Search, Zap, BrainCircuit, RefreshCw, ArrowRight } from 'lucide-react';

interface OfferCard {
  icon: React.ElementType;
  title: string;
  description: string;
  price: string;
  accent: string;
  accentBg: string;
  href?: string;
  featured?: boolean;
}

const OFFERS: OfferCard[] = [
  {
    icon: Search,
    title: 'Audit IA',
    description:
      "En une semaine, on cartographie vos processus, identifie les 3 à 5 opportunités IA les plus rentables et vous remet un plan d'action concret avec ROI estimé.",
    price: '990 € · 1 semaine',
    accent: '#3B82F6',
    accentBg: 'rgba(59,130,246,0.08)',
    href: '/chat',
  },
  {
    icon: Zap,
    title: 'Pack Automatisation',
    description:
      'On automatise 3 processus répétitifs dans votre entreprise — emails, documents, rapports, relances. Du temps retrouvé, dès la première semaine de déploiement.',
    price: '3 000 – 8 000 €',
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.08)',
    featured: true,
  },
  {
    icon: BrainCircuit,
    title: 'Agent IA Métier',
    description:
      'Un agent IA autonome sur-mesure pour un besoin précis : support client, qualification commerciale, base de connaissance interne, assistant RH...',
    price: '8 000 – 20 000 €',
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.08)',
  },
  {
    icon: RefreshCw,
    title: 'Retainer IA',
    description:
      'Votre équipe IA externalisée. Amélioration continue, nouveaux agents, monitoring des performances et support prioritaire chaque mois.',
    price: 'dès 800 €/mois',
    accent: '#22C55E',
    accentBg: 'rgba(34,197,94,0.08)',
  },
];

function OfferCardComponent({ offer, index }: { offer: OfferCard; index: number }) {
  const Icon = offer.icon;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col gap-5 p-7 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 h-full cursor-default"
    >
      {/* Featured badge */}
      {offer.featured && (
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2563EB]/60 to-transparent" />
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: offer.accentBg, color: offer.accent }}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-display text-lg font-semibold text-white">{offer.title}</h3>
        <p className="text-sm text-[#8B95A7] leading-relaxed">{offer.description}</p>
      </div>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{ color: offer.accent, backgroundColor: offer.accentBg }}
        >
          {offer.price}
        </span>
        {offer.href && (
          <span
            className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: offer.accent }}
          >
            Commencer <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </motion.div>
  );

  if (offer.href) {
    return <Link href={offer.href} className="h-full block">{card}</Link>;
  }
  return card;
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="offres" ref={ref} className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#3B82F6] mb-4">
            Nos offres
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight max-w-xl">
              Des résultats mesurables,{' '}
              <span className="text-gradient-blue">pas des promesses</span>
            </h2>
            <p className="text-[#8B95A7] max-w-sm lg:text-right leading-relaxed">
              Quatre formules claires pour intégrer l&apos;IA dans votre PME — du premier audit
              jusqu&apos;au déploiement d&apos;agents autonomes.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFERS.map((offer, i) => (
            <OfferCardComponent key={offer.title} offer={offer} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-[#8B95A7]">
            Pas encore sûr de quelle offre vous convient ?{' '}
            <Link href="/chat" className="text-[#3B82F6] hover:text-white transition-colors font-medium">
              Décrivez votre projet en 15 minutes →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
