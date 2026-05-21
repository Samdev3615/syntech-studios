'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FOOTER_LINKS = {
  Offres: [
    { label: 'Audit IA',           href: '#offres' },
    { label: 'Pack Automatisation', href: '#offres' },
    { label: 'Agent IA Métier',     href: '#offres' },
    { label: 'Retainer IA',         href: '#offres' },
  ],
  Studio: [
    { label: 'Notre processus',   href: '#processus' },
    { label: 'Confiance & RGPD',  href: '#confiance' },
    { label: 'Assistant IA',      href: '/chat' },
  ],
  Contact: [
    { label: 'contact@syntechstudios.fr', href: 'mailto:contact@syntechstudios.fr' },
    { label: 'Décrire mon projet →',      href: '/chat' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Main content */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — col span 2 */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/syntech-logo-full.svg"
                alt="SynTech Studios"
                width={180}
                height={45}
              />
            </Link>
            <p className="text-sm text-[#8B95A7] leading-relaxed max-w-xs">
              Studio IA spécialisé PME françaises. Agents sur-mesure, automatisation,
              intégration — livrés en semaines, pas en mois.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-[#8B95A7]">Paris, France · Données hébergées en UE</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8B95A7]">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto') || link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-sm text-[#8B95A7] hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[#8B95A7] hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-[#8B95A7]"
          >
            © {new Date().getFullYear()} SynTech Studios. Tous droits réservés.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#8B95A7]">
            <span>RGPD conforme</span>
            <span className="text-white/20">·</span>
            <span>Données UE</span>
            <span className="text-white/20">·</span>
            <span>EU AI Act</span>
            <span className="text-white/20">·</span>
            <span>NDA systématique</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
