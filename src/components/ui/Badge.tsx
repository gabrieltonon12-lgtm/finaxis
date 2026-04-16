import type { ReactNode } from 'react'

type BadgeVariant = 'teal' | 'orange' | 'neutral' | 'success' | 'warning' | 'ai'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  glow?: boolean
}

const variants: Record<BadgeVariant, string> = {
  teal: 'bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] border border-[rgba(0,229,195,0.25)]',
  orange: 'bg-[var(--accent-orange-dim)] text-[var(--accent-orange)] border border-[rgba(255,107,53,0.25)]',
  neutral: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
  success: 'bg-[rgba(0,229,195,0.1)] text-[var(--accent-teal)]',
  warning: 'bg-[rgba(255,107,53,0.1)] text-[var(--accent-orange)]',
  ai: 'bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] border border-[rgba(0,229,195,0.3)]',
}

export function Badge({ variant = 'neutral', children, className = '', glow = false }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        glow ? 'shadow-[0_0_8px_rgba(0,229,195,0.4)]' : '',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
