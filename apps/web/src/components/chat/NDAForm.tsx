'use client';
import { useState, type FormEvent } from 'react';
import { FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getNDAPDFUrl } from '@/lib/api';

interface NDAFormProps {
  onSubmit: (_name: string, _email: string, _company?: string) => void;
  isLoading: boolean;
}

interface NDAPendingProps {
  ndaId: string;
  onAccept: () => void;
  isLoading: boolean;
}

export function NDAForm({ onSubmit, isLoading }: NDAFormProps) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit(name.trim(), email.trim(), company.trim() || undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
              <FileText className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Accord de Confidentialité</h2>
          <p className="text-zinc-400 text-sm">
            Le mode confidentiel requiert la signature d&apos;un NDA avant de commencer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Nom complet *</label>
            <Input placeholder="Jean Dupont" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Email *</label>
            <Input type="email" placeholder="jean@entreprise.fr" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Société (optionnel)</label>
            <Input placeholder="Mon Entreprise SAS" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isLoading || !name || !email}
          >
            {isLoading ? 'Génération du NDA…' : 'Générer mon NDA'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function NDAPending({ ndaId, onAccept, isLoading }: NDAPendingProps) {
  const pdfUrl = getNDAPDFUrl(ndaId);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
              <FileText className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">Votre NDA est prêt</h2>
          <p className="text-zinc-400 text-sm">
            Lisez le document et acceptez-le pour démarrer votre session confidentielle.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ocean hover:text-ocean-light transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Lire l&apos;Accord de Confidentialité (PDF)</span>
          </a>

          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <p className="text-xs text-zinc-400">
              En cliquant sur «&nbsp;J&apos;accepte&nbsp;», vous reconnaissez avoir lu et accepté
              l&apos;intégralité des termes de cet accord. Cette acceptation a valeur de signature électronique.
            </p>
            <Button
              variant="gradient"
              className="w-full"
              onClick={onAccept}
              disabled={isLoading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isLoading ? 'Validation…' : "J'accepte et je commence"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
