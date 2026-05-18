import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/">
              <Image
                src="/syntech-logo-full.svg"
                alt="SynTech Studios"
                width={180}
                height={45}
              />
            </Link>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Studio IA spécialisé PME françaises. Agents sur-mesure, automatisation, intégration — livrés en semaines.
            </p>
          </div>

          {/* Offres */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Offres</p>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li><a href="#offres" className="hover:text-zinc-300 transition-colors">Audit IA</a></li>
              <li><a href="#offres" className="hover:text-zinc-300 transition-colors">Pack Automatisation</a></li>
              <li><a href="#offres" className="hover:text-zinc-300 transition-colors">Agent IA Métier</a></li>
              <li><a href="#offres" className="hover:text-zinc-300 transition-colors">Retainer IA</a></li>
            </ul>
          </div>

          {/* Studio */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Studio</p>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li><a href="#processus" className="hover:text-zinc-300 transition-colors">Notre processus</a></li>
              <li><a href="#confiance" className="hover:text-zinc-300 transition-colors">Confiance & RGPD</a></li>
              <li><Link href="/chat" className="hover:text-zinc-300 transition-colors">Assistant IA</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Contact</p>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <a href="mailto:contact@syntechstudios.fr" className="hover:text-zinc-300 transition-colors">
                  contact@syntechstudios.fr
                </a>
              </li>
              <li>
                <Link href="/chat" className="hover:text-zinc-300 transition-colors">
                  Décrire mon projet →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-6 bg-zinc-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} SynTech Studios. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>RGPD conforme</span>
            <span className="text-zinc-700">·</span>
            <span>Données hébergées en UE</span>
            <span className="text-zinc-700">·</span>
            <span>EU AI Act conforme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
