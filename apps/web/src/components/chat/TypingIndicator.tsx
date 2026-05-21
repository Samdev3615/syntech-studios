'use client';
import { Sparkles } from 'lucide-react';

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={`flex gap-3 items-start ${className ?? ''}`}>
      <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-2 flex items-center justify-center shadow-lg shadow-brand-blue/20">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-brand-bg-3 border border-zinc-700/50 rounded-2xl rounded-bl-sm">
        <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
