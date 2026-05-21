'use client';
import { useRef, useState, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocCheckStepProps {
  onUpload: (_file: File) => void;
  onSkip: () => void;
  isLoading: boolean;
}

const ACCEPTED = '.pdf,.doc,.docx,.txt';

export function DocCheckStep({ onUpload, onSkip, isLoading }: DocCheckStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg space-y-8"
      >
        {/* Icon + titre */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-ocean/10 border border-ocean/20">
              <FileText className="w-8 h-8 text-ocean" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Avez-vous déjà un cahier des charges ?
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
            Si oui, nous l&apos;analyserons instantanément et ne vous poserons que les questions
            <span className="text-ocean font-medium"> essentielles</span>.
          </p>
        </div>

        {/* Zone de drop / sélection */}
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${dragging
                ? 'border-ocean bg-ocean/10 scale-[1.02]'
                : 'border-zinc-700 hover:border-ocean/50 hover:bg-zinc-800/30'
              }
            `}
          >
            <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium">
              Glissez votre fichier ici ou <span className="text-ocean underline">parcourir</span>
            </p>
            <p className="text-xs text-zinc-600 mt-1">PDF, DOCX, TXT — max 10 Mo</p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-zinc-800/60 border border-zinc-700 rounded-xl p-4"
          >
            <FileText className="w-5 h-5 text-ocean shrink-0" />
            <span className="text-sm text-zinc-200 flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-zinc-500 hover:text-zinc-300 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {selectedFile ? (
            <Button
              variant="gradient"
              className="w-full"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Analyse en cours…' : 'Analyser le document'}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full border-ocean/30 text-ocean hover:bg-ocean/10"
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choisir un document
            </Button>
          )}

          <button
            onClick={onSkip}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2 disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
            Non, partir de zéro avec l&apos;assistant
          </button>
        </div>
      </motion.div>
    </div>
  );
}
