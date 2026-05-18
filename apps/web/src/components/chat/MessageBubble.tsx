'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* Avatar IA */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-ocean-light to-ocean-dark flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
          IA
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-ocean/20 border border-ocean/30 text-white rounded-br-sm'
            : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 rounded-bl-sm'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={cn('text-[10px] mt-1.5', isUser ? 'text-ocean/60' : 'text-zinc-500')}>
          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
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
      <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-800/80 border border-zinc-700/50 text-zinc-100 text-sm leading-relaxed">
        <p className="whitespace-pre-wrap">{content}<span className="inline-block w-0.5 h-4 bg-ocean ml-0.5 animate-pulse" /></p>
      </div>
    </motion.div>
  );
}
