import * as React from 'react'
import { cn } from '@/lib/utils'

// Heading H1
export function H1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

// Heading H2
export function H2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

// Heading H3
export function H3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

// Heading H4
export function H4({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

// Paragraph
export function P({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-7 text-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Lead (sous-titre accrocheur)
export function Lead({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xl text-muted-foreground leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
}

// Large
export function Large({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </div>
  )
}

// Small
export function Small({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn('text-sm font-medium leading-none text-foreground', className)}
      {...props}
    >
      {children}
    </small>
  )
}

// Muted (texte discret)
export function Muted({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

// Code (inline)
export function Code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-ocean-light',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

// Blockquote
export function Blockquote({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <blockquote
      className={cn(
        'mt-6 border-l-2 border-ocean pl-6 italic text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

// Gradient Heading (pour les titres hero)
export function GradientHeading({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
        'bg-gradient-to-r from-ocean-light via-ocean to-ocean-dark bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
