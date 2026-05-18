'use client';
import { cn } from '@/lib/utils';

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1 px-4 py-3', className)}>
      <span className="text-xs text-zinc-500 mr-1">SynTech IA</span>
      <div className="flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-ocean animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-ocean animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-ocean animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
