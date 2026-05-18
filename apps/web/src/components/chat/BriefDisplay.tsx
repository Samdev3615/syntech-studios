'use client';
import { motion } from 'framer-motion';
import { Download, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBriefPDFUrl } from '@/lib/api';
import type { BriefResult } from '@/hooks/useChat';

interface BriefDisplayProps {
  result: BriefResult;
  sessionId: string;
  onNewSession: () => void;
}

interface BriefData {
  projectName?: string;
  summary?: string;
  objectives?: string[];
  mvpFeatures?: { name?: string; priority?: string }[];
  constraints?: { budget?: string; deadline?: string };
  confidenceScore?: number;
  openQuestions?: string[];
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const sectionVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export function BriefDisplay({ result, sessionId, onNewSession }: BriefDisplayProps) {
  const brief = result.brief as BriefData;
  const pdfUrl = getBriefPDFUrl(sessionId);
  const score = brief.confidenceScore ? Math.round(brief.confidenceScore * 100) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-10">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-2xl space-y-6"
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center space-y-2"
        >
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-ocean/10 text-ocean">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Votre Brief est Prêt</h2>
          <p className="text-zinc-400 text-sm">
            {brief.projectName && <span className="text-ocean font-medium">{brief.projectName}</span>}
            {score && <span className="text-zinc-500"> · Complétude : {score}%</span>}
          </p>
        </motion.div>

        {/* Summary card */}
        {brief.summary && (
          <motion.div variants={sectionVariants} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-ocean uppercase tracking-wider mb-2">Résumé</h3>
            <p className="text-zinc-200 text-sm leading-relaxed">{brief.summary}</p>
          </motion.div>
        )}

        {/* MVP features */}
        {brief.mvpFeatures?.length ? (
          <motion.div variants={sectionVariants} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-ocean uppercase tracking-wider mb-3">Fonctionnalités MVP</h3>
            <div className="flex flex-wrap gap-2">
              {brief.mvpFeatures.map((f, i) => (
                <Badge
                  key={i}
                  variant={f.priority === 'high' ? 'destructive' : f.priority === 'low' ? 'success' : 'warning'}
                  className="text-xs"
                >
                  {f.name}
                </Badge>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Constraints */}
        {(brief.constraints?.budget || brief.constraints?.deadline) && (
          <motion.div variants={sectionVariants} className="grid grid-cols-2 gap-3">
            {brief.constraints.budget && brief.constraints.budget !== 'null' && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Budget</p>
                <p className="text-sm text-white font-medium">{brief.constraints.budget}</p>
              </div>
            )}
            {brief.constraints.deadline && brief.constraints.deadline !== 'null' && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Délai</p>
                <p className="text-sm text-white font-medium">{brief.constraints.deadline}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Open questions */}
        {brief.openQuestions?.length ? (
          <motion.div variants={sectionVariants} className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              Points à clarifier
            </h3>
            <ul className="space-y-1">
              {brief.openQuestions.map((q, i) => (
                <li key={i} className="text-xs text-zinc-400">? {q}</li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        {/* Actions */}
        <motion.div variants={sectionVariants} className="flex gap-3">
          <a href={pdfUrl} download className="flex-1">
            <Button variant="gradient" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le PDF
            </Button>
          </a>
          <Button variant="outline" onClick={onNewSession}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Nouvelle session
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
}
