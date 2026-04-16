import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { Card } from '@/components/ui/Card'
import { formatBRL, formatPercent } from '@/lib/formatters'

interface KPICardProps {
  label: string
  value: number
  previousValue: number
  sparklineData: number[]
  icon: LucideIcon
  format?: 'currency' | 'percent'
  delay?: number
}

function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(target * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return current
}

export function KPICard({ label, value, previousValue, sparklineData, icon: Icon, format = 'currency', delay = 0 }: KPICardProps) {
  const animated = useCountUp(value)
  const variation = previousValue !== 0 ? ((value - previousValue) / Math.abs(previousValue)) * 100 : 0
  const isPositive = variation >= 0
  const sparkData = sparklineData.map((v, i) => ({ v, i }))

  return (
    <Card
      className="flex flex-col gap-3 animate-fade-slide-up"
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-teal-dim)] flex items-center justify-center">
          <Icon size={16} className="text-[var(--accent-teal)]" aria-hidden="true" />
        </div>
        <span
          className={[
            'text-xs font-medium px-2 py-0.5 rounded-full',
            isPositive
              ? 'bg-[rgba(0,229,195,0.1)] text-[var(--accent-teal)]'
              : 'bg-[var(--accent-orange-dim)] text-[var(--accent-orange)]',
          ].join(' ')}
        >
          {formatPercent(variation)}
        </span>
      </div>

      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-0.5">{label}</p>
        <p className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
          {format === 'currency' ? formatBRL(animated) : `${animated.toFixed(1)}%`}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          vs. {format === 'currency' ? formatBRL(previousValue) : `${previousValue.toFixed(1)}%`} anterior
        </p>
      </div>

      {sparkData.length > 0 && (
        <div className="h-10" aria-label={`Sparkline de ${label}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }}
                formatter={(v) => [format === 'currency' ? formatBRL(Number(v)) : `${Number(v).toFixed(1)}%`, label]}
                labelFormatter={() => ''}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--accent-teal)"
                strokeWidth={1.5}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
