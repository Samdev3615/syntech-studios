'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CalendarDays, ShieldCheck } from 'lucide-react';

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="apropos" ref={ref} className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#111827]"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/60 to-transparent" />

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#2563EB]/8 blur-3xl pointer-events-none rounded-full" />

          {/* Grid bg */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-8 py-20 lg:py-24 gap-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/8 text-xs font-medium text-[#3B82F6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Réponse sous 24h
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight max-w-2xl"
            >
              Prêt à installer votre{' '}
              <span className="text-gradient-blue">système IA&nbsp;?</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="text-lg text-[#B6C2D1] max-w-xl leading-relaxed"
            >
              Décrivez votre activité et vos enjeux en 15 minutes. Notre IA structure votre brief
              et nous vous répondons avec une proposition concrète sous 24h.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.38 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(37,99,235,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold rounded-2xl transition-colors duration-200 shadow-xl shadow-[#2563EB]/25 w-full sm:w-auto"
                >
                  Décrire mon projet
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <a href="mailto:contact@syntechstudios.fr">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-white/[0.12] hover:border-white/20 hover:bg-white/[0.04] text-[#B6C2D1] hover:text-white font-semibold rounded-2xl transition-all duration-200 w-full sm:w-auto"
                >
                  <CalendarDays className="w-4 h-4" />
                  Planifier un appel
                </motion.button>
              </a>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-5 text-xs text-[#8B95A7]"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                100% confidentiel
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                Aucune inscription requise
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                NDA proposé dès le premier échange
              </span>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
