import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glow?: boolean
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ children, padding = 'md', glow = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]',
        paddingStyles[padding],
        glow ? 'shadow-[var(--accent-teal-glow)]' : 'shadow-[var(--shadow-sm)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider ${className}`}>
      {children}
    </h3>
  )
}
