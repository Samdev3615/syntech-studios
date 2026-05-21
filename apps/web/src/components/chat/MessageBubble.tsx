'use client';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

// ─── Markdown renderer léger ──────────────────────────────────────────────────
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-zinc-200">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="px-1 py-0.5 bg-zinc-700 rounded text-xs font-mono text-ocean">{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text: string): ReactNode {
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={key} className="space-y-0.5 my-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-ocean mt-0.5 shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Bullet list
    if (/^[-*•]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*•]\s/, ''));
      return;
    }
    flushList(`list-${i}`);

    if (!trimmed) {
      nodes.push(<div key={i} className="h-2" />);
      return;
    }

    // Header h3
    if (trimmed.startsWith('### ')) {
      nodes.push(<p key={i} className="font-semibold text-ocean text-sm mt-2">{renderInline(trimmed.slice(4))}</p>);
      return;
    }
    // Header h2
    if (trimmed.startsWith('## ')) {
      nodes.push(<p key={i} className="font-bold text-white text-sm mt-2">{renderInline(trimmed.slice(3))}</p>);
      return;
    }

    nodes.push(<p key={i} className="leading-relaxed">{renderInline(trimmed)}</p>);
  });

  flushList('list-end');
  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

// ─── Quick replies ────────────────────────────────────────────────────────────
function extractQuickReplies(content: string): string[] {
  const lines = content.split('\n').filter(l => l.trim());
  const lastLine = lines[lines.length - 1] ?? '';
  if (!lastLine.includes('?')) return [];

  const lower = lastLine.toLowerCase();

  // Oui/Non uniquement pour les vraies questions binaires (pas "qu'est-ce que")
  if (/\b(avez-vous|êtes-vous|disposez-vous|possédez-vous|est-ce que vous)\b/.test(lower))
    return ['Oui', 'Non, pas encore', 'Je ne sais pas encore'];

  if (/\b(budget|coût|montant|prix|financement)\b/.test(lower))
    return ['< 5 000 €', '5 000 – 20 000 €', '> 20 000 €', 'Non défini'];

  if (/\b(délai|deadline|livraison|durée|calendrier|quand)\b/.test(lower))
    return ['1–3 mois', '3–6 mois', '6–12 mois', 'Flexible'];

  if (/\b(technologie|stack|framework|langage|outil)\b/.test(lower))
    return ["Pas de préférence", "J'ai des contraintes techniques", "À vous de conseiller"];

  if (/\b(cible|utilisateur|audience|client|marché)\b/.test(lower))
    return ["Grand public", "Professionnels B2B", "Interne (salariés)", "Niche spécifique"];

  return ['Oui, exactement', 'Pas tout à fait', 'Je vais préciser…'];
}

// ─── Composants ──────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: Message;
  isLastAssistant?: boolean;
  onQuickReply?: (_text: string) => void;
  disabled?: boolean;
}

export function MessageBubble({ message, isLastAssistant, onQuickReply, disabled }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const quickReplies = isLastAssistant && !isUser && onQuickReply
    ? extractQuickReplies(message.content)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}
    >
      <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
        {!isUser && (
          <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-ocean-light to-ocean-dark flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
            IA
          </div>
        )}
        <div
          className={cn(
            'max-w-[75%] rounded-2xl px-4 py-3',
            isUser
              ? 'bg-ocean/20 border border-ocean/30 text-white rounded-br-sm text-sm leading-relaxed'
              : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 rounded-bl-sm'
          )}
        >
          {isUser
            ? <p className="whitespace-pre-wrap">{message.content}</p>
            : renderMarkdown(message.content)
          }
          <p className={cn('text-[10px] mt-1.5', isUser ? 'text-ocean/60' : 'text-zinc-500')}>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Quick reply chips */}
      {quickReplies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="flex flex-wrap gap-2 pl-10"
        >
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => onQuickReply?.(reply)}
              disabled={disabled}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs border transition-all',
                'border-ocean/40 text-ocean bg-ocean/5',
                'hover:bg-ocean/15 hover:border-ocean/70',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              {reply}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Message en cours de streaming
export function StreamingBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex gap-3 justify-start"
    >
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-ocean-light to-ocean-dark flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
        IA
      </div>
      <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-800/80 border border-zinc-700/50 text-zinc-100">
        {renderMarkdown(content)}
        <span className="inline-block w-0.5 h-3.5 bg-ocean ml-0.5 animate-pulse align-middle" />
      </div>
    </motion.div>
  );
}
