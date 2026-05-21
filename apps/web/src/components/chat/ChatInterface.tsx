'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, FileText, AlertCircle, Download, RotateCcw,
  CheckCircle2, ArrowLeft, Shield, Zap, Lock,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ModeSelector } from './ModeSelector';
import { NDAForm, NDAPending } from './NDAForm';
import { MessageBubble, StreamingBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { BriefDisplay } from './BriefDisplay';
import { DocCheckStep } from './DocCheckStep';
import { Button } from '@/components/ui/button';
import { getBriefPDFUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

// ─── Mode config ──────────────────────────────────────────────────────────────
type ChatPrivacyMode = 'demo' | 'private' | 'nda';

const MODE_CONFIG: Record<ChatPrivacyMode, {
  label: string; color: string; bg: string; border: string;
  Icon: typeof Zap;
}> = {
  demo:    { label: 'Mode Démo',        color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/30',    Icon: Zap },
  private: { label: 'Mode Privé',       color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30', Icon: Shield },
  nda:     { label: 'Confidentiel NDA', color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/30',  Icon: Lock },
};

// ─── Sidebar stepper ──────────────────────────────────────────────────────────
function buildSteps(chatState: string, userMessageCount: number, minExchanges: number) {
  const done = (states: string[]) => states.includes(chatState);

  return [
    {
      id: 'mode',
      label: 'Mode sélectionné',
      done: true,
      active: false,
      sub: undefined as string | undefined,
    },
    {
      id: 'doc',
      label: 'Document',
      done: !done(['mode-select', 'doc-check', 'nda-form', 'nda-pending']),
      active: done(['doc-check', 'nda-form', 'nda-pending']),
      sub: done(['doc-check']) ? 'Optionnel' : undefined,
    },
    {
      id: 'conversation',
      label: 'Conversation',
      done: done(['brief-ready', 'brief-complete']),
      active: done(['chatting']),
      sub: done(['chatting']) ? `${userMessageCount} / ${minExchanges} échanges` : undefined,
    },
    {
      id: 'brief',
      label: 'Brief généré',
      done: done(['brief-complete']),
      active: done(['brief-ready']),
      sub: undefined,
    },
  ];
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
interface SidebarProps {
  chatState: string;
  userMessageCount: number;
  minExchanges: number;
  privacyMode: ChatPrivacyMode | null;
  sessionId: string | null;
}

function Sidebar({ chatState, userMessageCount, minExchanges, privacyMode, sessionId }: SidebarProps) {
  const steps = buildSteps(chatState, userMessageCount, minExchanges);
  const modeConfig = privacyMode ? MODE_CONFIG[privacyMode] : null;
  const briefDone = chatState === 'brief-complete' && !!sessionId;
  const ModeIcon = modeConfig?.Icon;

  return (
    <aside className="hidden md:flex w-56 shrink-0 h-screen flex-col bg-[#06090f] border-r border-zinc-800/50">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <Link href="/">
          <Image src="/syntech-logo-full.svg" alt="SynTech Studios" width={110} height={28} priority />
        </Link>
        <p className="text-[10px] text-zinc-600 mt-1 font-medium tracking-widest uppercase">Assistant IA</p>
      </div>

      {/* Mode badge */}
      {modeConfig && ModeIcon && (
        <div className="px-5 py-4 border-b border-zinc-800/50">
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-2">Mode actif</p>
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium',
            modeConfig.bg, modeConfig.border, modeConfig.color
          )}>
            <ModeIcon className="w-3.5 h-3.5 shrink-0" />
            {modeConfig.label}
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex-1 px-5 py-5 overflow-hidden">
        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-5">Progression</p>
        <div>
          {steps.map((step, i) => (
            <div key={step.id} className="flex gap-3">
              {/* Dot + connector line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500',
                  step.done   ? 'bg-brand-blue border-2 border-brand-blue' :
                  step.active ? 'bg-transparent border-2 border-brand-blue' :
                                'bg-transparent border-2 border-zinc-700'
                )}>
                  {step.done
                    ? <CheckCircle2 className="w-3 h-3 text-white" />
                    : step.active
                    ? <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                    : <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  }
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    'w-px flex-1 min-h-[24px] my-1 transition-colors duration-500',
                    step.done ? 'bg-brand-blue/35' : 'bg-zinc-800'
                  )} />
                )}
              </div>

              {/* Label */}
              <div className={cn('pb-6', i === steps.length - 1 && 'pb-0')}>
                <p className={cn(
                  'text-xs leading-tight transition-colors duration-300',
                  step.done   ? 'text-zinc-300 font-medium' :
                  step.active ? 'text-white font-semibold' :
                                'text-zinc-600'
                )}>
                  {step.label}
                </p>
                {step.sub && (
                  <p className="text-[10px] text-brand-blue mt-0.5 font-medium">{step.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-5 pt-3 border-t border-zinc-800/50 space-y-1.5">
        {briefDone && sessionId && (
          <a
            href={getBriefPDFUrl(sessionId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-medium hover:bg-brand-blue/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            Télécharger le brief
          </a>
        )}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          Nouvelle session
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/40 text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          Retour au site
        </Link>
      </div>
    </aside>
  );
}

// ─── ChatInterface ────────────────────────────────────────────────────────────
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
    userMessageCount, minExchanges, lastSuggestions,
    selectMode, submitNDAForm, handleAcceptNDA,
    skipDocAndStart, uploadDocAndStart,
    sendMessage, generateBrief, clearError,
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isTyping]);

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

  const handleQuickReply = (text: string) => {
    if (isLoading) return;
    sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewSession = () => { window.location.reload(); };

  const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
  const lastAssistantId = lastAssistantIndex >= 0
    ? messages[messages.length - 1 - lastAssistantIndex].id
    : null;

  const isChatActive = chatState === 'chatting' || chatState === 'brief-ready';
  const showSidebar = chatState !== 'mode-select';
  const modeConfig = privacyMode ? MODE_CONFIG[privacyMode as ChatPrivacyMode] : null;

  const renderContent = () => {
    if (chatState === 'doc-check') return (
      <DocCheckStep onUpload={uploadDocAndStart} onSkip={skipDocAndStart} isLoading={isLoading} />
    );
    if (chatState === 'nda-form') return <NDAForm onSubmit={submitNDAForm} isLoading={isLoading} />;
    if (chatState === 'nda-pending' && ndaId) return <NDAPending ndaId={ndaId} onAccept={handleAcceptNDA} isLoading={isLoading} />;
    if (chatState === 'brief-complete' && briefResult && sessionId) return (
      <BriefDisplay result={briefResult} sessionId={sessionId} onNewSession={handleNewSession} />
    );
    return null;
  };

  return (
    <div className="flex h-screen bg-brand-bg text-white overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            key="sidebar"
            initial={{ x: -224, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -224, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="shrink-0"
          >
            <Sidebar
              chatState={chatState}
              userMessageCount={userMessageCount}
              minExchanges={minExchanges}
              privacyMode={privacyMode as ChatPrivacyMode | null}
              sessionId={sessionId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mode select: full-screen with top bar */}
        {chatState === 'mode-select' && (
          <div className="flex flex-col h-full">
            <header className="shrink-0 px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between">
              <Image src="/syntech-logo-full.svg" alt="SynTech Studios" width={120} height={30} priority />
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </Link>
            </header>
            <div className="flex-1 overflow-y-auto">
              <ModeSelector onSelect={selectMode} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Post mode-select states: sidebar + main area */}
        {chatState !== 'mode-select' && (
          <>
            {/* Mobile-only header */}
            <header className="md:hidden shrink-0 px-4 py-3 border-b border-zinc-800/50 bg-[#06090f] flex items-center gap-3">
              <Image src="/syntech-logo-full.svg" alt="SynTech Studios" width={100} height={26} priority />
              {modeConfig && (
                <span className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded-full border ml-auto',
                  modeConfig.bg, modeConfig.border, modeConfig.color
                )}>
                  {modeConfig.label}
                </span>
              )}
            </header>

            {/* Error banner */}
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
                    <button onClick={clearError} className="ml-auto hover:text-red-300">✕</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
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
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto px-5 py-6 space-y-5"
                  >
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLastAssistant={msg.id === lastAssistantId && msg.id !== 'welcome' && !streamingContent && !isTyping}
                        suggestions={msg.id === lastAssistantId ? lastSuggestions : []}
                        onQuickReply={handleQuickReply}
                        disabled={isLoading || chatState === 'brief-ready'}
                      />
                    ))}

                    {streamingContent && <StreamingBubble content={streamingContent} />}
                    {isTyping && !streamingContent && <TypingIndicator />}

                    {/* Brief ready banner */}
                    <AnimatePresence>
                      {chatState === 'brief-ready' && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center py-4"
                        >
                          <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-2xl px-6 py-5 text-center space-y-4 max-w-sm w-full">
                            <div className="flex items-center justify-center gap-2 text-brand-blue">
                              <FileText className="w-5 h-5" />
                              <span className="font-semibold text-sm">Brief prêt à générer</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Nous avons suffisamment d&apos;informations pour créer votre cahier des charges.
                            </p>
                            <Button
                              variant="gradient"
                              size="sm"
                              onClick={generateBrief}
                              disabled={isLoading}
                              className="w-full"
                            >
                              {isLoading ? 'Génération…' : 'Générer mon Brief →'}
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

            {/* Input bar */}
            <AnimatePresence>
              {isChatActive && (
                <motion.footer
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 px-5 py-4 border-t border-zinc-800/50 bg-brand-bg/80 backdrop-blur-sm"
                >
                  <div className="flex items-end gap-3 max-w-2xl mx-auto">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Décrivez votre projet…"
                      disabled={isLoading || chatState === 'brief-ready'}
                      className={cn(
                        'flex-1 resize-none rounded-xl px-4 py-3 text-sm',
                        'bg-brand-bg-3 border border-zinc-700/60',
                        'text-white placeholder:text-zinc-600',
                        'focus:outline-none focus:border-brand-blue/50',
                        'transition-colors max-h-32 overflow-y-auto',
                        'disabled:opacity-40 disabled:cursor-not-allowed'
                      )}
                      style={{ lineHeight: '1.5', height: '44px' }}
                    />
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isLoading || chatState === 'brief-ready'}
                      className="shrink-0 h-11 w-11 p-0 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-zinc-700 mt-2">
                    Entrée pour envoyer · Maj+Entrée pour sauter une ligne
                  </p>
                </motion.footer>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
