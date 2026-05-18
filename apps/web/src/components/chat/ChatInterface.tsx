'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, Shield, Zap, Lock, AlertCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ModeSelector } from './ModeSelector';
import { NDAForm, NDAPending } from './NDAForm';
import { MessageBubble, StreamingBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { BriefDisplay } from './BriefDisplay';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MODE_ICONS = {
  demo:    <Zap className="w-3 h-3" />,
  private: <Shield className="w-3 h-3" />,
  nda:     <Lock className="w-3 h-3" />,
} as const;

const MODE_LABELS = {
  demo:    'Démo',
  private: 'Privé',
  nda:     'Confidentiel NDA',
} as const;

// Variants pour les transitions d'état
const stateVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

export function ChatInterface() {
  const {
    chatState, messages, streamingContent, isTyping,
    sessionId, privacyMode, ndaId,
    briefResult, error, isLoading,
    selectMode, submitNDAForm, handleAcceptNDA,
    sendMessage, generateBrief, clearError,
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isTyping]);

  // Auto-resize du textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewSession = () => {
    window.location.reload();
  };

  // ─── Vues selon l'état ───────────────────────────────────────────────────
  const renderContent = () => {
    if (chatState === 'mode-select') {
      return <ModeSelector onSelect={selectMode} isLoading={isLoading} />;
    }
    if (chatState === 'nda-form') {
      return <NDAForm onSubmit={submitNDAForm} isLoading={isLoading} />;
    }
    if (chatState === 'nda-pending' && ndaId) {
      return <NDAPending ndaId={ndaId} onAccept={handleAcceptNDA} isLoading={isLoading} />;
    }
    if (chatState === 'brief-complete' && briefResult && sessionId) {
      return <BriefDisplay result={briefResult} sessionId={sessionId} onNewSession={handleNewSession} />;
    }
    // chatting | brief-ready
    return null;
  };

  const isChatActive = chatState === 'chatting' || chatState === 'brief-ready';

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-white">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Image src="/syntech-logo-full.svg" alt="SynTech Studios" width={130} height={33} priority />
          <span className="text-zinc-600 text-xs hidden sm:block">· Assistant Projet</span>
        </div>

        <AnimatePresence mode="wait">
          {privacyMode && (
            <motion.div
              key={privacyMode}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border',
                privacyMode === 'demo'    && 'border-ocean/30 text-ocean bg-ocean/5',
                privacyMode === 'private' && 'border-violet-400/30 text-violet-400 bg-violet-400/5',
                privacyMode === 'nda'     && 'border-amber-400/30 text-amber-400 bg-amber-400/5',
              )}
            >
              {MODE_ICONS[privacyMode]}
              <span>{MODE_LABELS[privacyMode]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
              <button onClick={clearError} className="ml-auto text-red-400/60 hover:text-red-400">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!isChatActive ? (
            <motion.div
              key={chatState}
              variants={stateVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full overflow-y-auto"
            >
              {renderContent()}
            </motion.div>
          ) : (
            /* Messages list */
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto px-4 py-5 space-y-4"
            >
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Streaming */}
              {streamingContent && <StreamingBubble content={streamingContent} />}

              {/* Typing indicator (avant que les chunks arrivent) */}
              {isTyping && !streamingContent && <TypingIndicator />}

              {/* Brief ready banner */}
              <AnimatePresence>
                {chatState === 'brief-ready' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      boxShadow: [
                        '0 0 0 0 rgba(14,165,233,0)',
                        '0 0 0 10px rgba(14,165,233,0.15)',
                        '0 0 0 0 rgba(14,165,233,0)',
                      ],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      y: { duration: 0.3 },
                      boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                    }}
                    className="flex items-center justify-center"
                  >
                    <div className="bg-ocean/10 border border-ocean/30 rounded-xl px-5 py-4 text-center space-y-3 max-w-sm">
                      <p className="text-sm text-zinc-200">
                        <FileText className="w-4 h-4 inline mr-1.5 text-ocean" />
                        Nous avons suffisamment d&apos;informations pour générer votre brief.
                      </p>
                      <Button variant="gradient" size="sm" onClick={generateBrief} disabled={isLoading}>
                        {isLoading ? 'Génération…' : 'Générer mon Brief'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Input bar (visible seulement en mode chat) ────────────────────── */}
      <AnimatePresence>
        {isChatActive && (
          <motion.footer
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 px-4 py-3 border-t border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm"
          >
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Décrivez votre projet…"
                disabled={isLoading || chatState === 'brief-ready'}
                className={cn(
                  'flex-1 resize-none rounded-xl px-4 py-3 text-sm',
                  'bg-zinc-800/60 border border-zinc-700/50',
                  'text-white placeholder:text-zinc-500',
                  'focus:outline-none focus:border-ocean/50',
                  'transition-colors max-h-32 overflow-y-auto',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                style={{ lineHeight: '1.5', height: '44px' }}
              />
              <Button
                variant="gradient"
                size="sm"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || chatState === 'brief-ready'}
                className="shrink-0 h-11 w-11 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-center text-[10px] text-zinc-600 mt-2">
              Entrée pour envoyer · Maj+Entrée pour sauter une ligne
            </p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
