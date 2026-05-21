'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  color: string;
}

const STATS: Stat[] = [
  {
    value: 47,
    suffix: '+',
    label: 'projets livrés',
    color: '#3B82F6',
  },
  {
    value: 98,
    suffix: '%',
    label: 'taux de satisfaction',
    color: '#22C55E',
  },
  {
    value: 42,
    suffix: '%',
    prefix: '+',
    label: 'gain de productivité moyen',
    color: '#F59E0B',
  },
  {
    value: 3,
    suffix: ' sem.',
    label: 'pour un premier résultat',
    color: '#8B5CF6',
  },
];

function AnimatedCounter({ value, suffix, prefix = '', color }: Omit<Stat, 'label'>) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;

    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl sm:text-6xl font-bold tabular-nums" style={{ color }}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="expertise" ref={ref} className="py-28 px-6 bg-[#111827]/40">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#3B82F6] mb-4">
            En chiffres
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
            Des résultats qui parlent{' '}
            <span className="text-gradient-blue">d&apos;eux-mêmes</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center gap-3 p-8 rounded-2xl bg-[#111827] border border-white/[0.08]"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                color={stat.color}
              />
              <p className="text-sm text-[#8B95A7] leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
