'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/60'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/syntech-logo-full.svg"
            alt="SynTech Studios"
            width={260}
            height={65}
            priority
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#offres" className="hover:text-white transition-colors">
            Nos offres
          </a>
          <a href="#processus" className="hover:text-white transition-colors">
            Notre processus
          </a>
          <a href="#confiance" className="hover:text-white transition-colors">
            Confiance
          </a>
        </nav>

        {/* CTA */}
        <Link href="/chat">
          <Button variant="gradient" size="sm">
            Décrire mon projet →
          </Button>
        </Link>
      </div>
    </header>
  );
}
