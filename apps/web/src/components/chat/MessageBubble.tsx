'use client';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

// ─── Markdown renderer ────────────────────────────────────────────────────────
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-zinc-200">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="px-1.5 py-0.5 bg-brand-bg-3 rounded text-xs font-mono text-brand-blue-2">{part.slice(1, -1)}</code>;
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
        <ul key={key} className="space-y-1 my-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-brand-blue mt-0.5 shrink-0">•</span>
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

    if (/^[-*•]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*•]\s/, ''));
      return;
    }
    flushList(`list-${i}`);

    if (!trimmed) {
      nodes.push(<div key={i} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      nodes.push(<p key={i} className="font-semibold text-brand-blue text-sm mt-2">{renderInline(trimmed.slice(4))}</p>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      nodes.push(<p key={i} className="font-bold text-white text-sm mt-2">{renderInline(trimmed.slice(3))}</p>);
      return;
    }

    nodes.push(<p key={i} className="leading-relaxed">{renderInline(trimmed)}</p>);
  });

  flushList('list-end');
  return <div className="space-y-0.5 text-sm">{nodes}</div>;
}

// ─── AI Avatar ────────────────────────────────────────────────────────────────
function AIAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-2 flex items-center justify-center mt-0.5 shadow-lg shadow-brand-blue/20">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: Message;
  isLastAssistant?: boolean;
  suggestions?: string[];
  onQuickReply?: (_text: string) => void;
  disabled?: boolean;
}

export function MessageBubble({ message, isLastAssistant, suggestions, onQuickReply, disabled }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const quickReplies = isLastAssistant && !isUser && suggestions?.length ? suggestions : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex flex-col gap-3', isUser ? 'items-end' : 'items-start')}
    >
      <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
        {!isUser && <AIAvatar />}

        <div
          className={cn(
            'max-w-[78%] rounded-2xl px-4 py-3',
            isUser
              ? 'bg-brand-blue/15 border border-brand-blue/25 text-white rounded-br-sm text-sm leading-relaxed'
              : 'bg-brand-bg-3 border border-zinc-700/50 text-zinc-100 rounded-bl-sm'
          )}
        >
          {isUser
            ? <p className="whitespace-pre-wrap">{message.content}</p>
            : renderMarkdown(message.content)
          }
          <p className={cn('text-[10px] mt-2', isUser ? 'text-brand-blue/50' : 'text-zinc-600')}>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Quick reply chips */}
      {quickReplies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="flex flex-wrap gap-2.5 pl-11"
        >
          {quickReplies.map((reply, i) => (
            <motion.button
              key={reply}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
              whileHover={!disabled ? { scale: 1.04, y: -2 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              onClick={() => onQuickReply?.(reply)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm border-2 font-medium transition-all duration-200',
                'border-brand-blue/30 text-brand-blue-2 bg-brand-blue/5',
                'hover:bg-brand-blue/15 hover:border-brand-blue/60 hover:text-white',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0'
              )}
            >
              {reply}
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── StreamingBubble ──────────────────────────────────────────────────────────
export function StreamingBubble({ content }: { content: string }) {
  const display = content.split('\n').filter(l => !l.trimStart().startsWith('SUGGESTIONS:')).join('\n').trimEnd();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex gap-3 justify-start"
    >
      <AIAvatar />
      <div className="max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-3 bg-brand-bg-3 border border-zinc-700/50 text-zinc-100">
        {renderMarkdown(display)}
        <span className="inline-block w-0.5 h-3.5 bg-brand-blue ml-0.5 animate-pulse align-middle rounded-full" />
      </div>
    </motion.div>
  );
}
