import { usePeriod } from '@/hooks/usePeriod'
import type { Period } from '@/types/subscription'

interface PeriodTimelineProps {
  periods: Period[]
  year: number
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function PeriodTimeline({ periods, year }: PeriodTimelineProps) {
  const { month: selectedMonth, year: selectedYear, setSelectedPeriod } = usePeriod()

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1" role="navigation" aria-label="Navegação por período">
      {MONTHS.map((label, i) => {
        const m = i + 1
        const hasPeriod = periods.some((p) => p.year === year && p.month === m)
        const isSelected = selectedYear === year && selectedMonth === m
        const isClosed = periods.find((p) => p.year === year && p.month === m)?.status === 'closed'

        return (
          <button
            key={m}
            onClick={() => setSelectedPeriod(year, m)}
            className="flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--bg-elevated)] shrink-0"
            aria-label={`${label} ${year}${isSelected ? ' (selecionado)' : ''}`}
          >
            <span className={['text-xs transition-colors', isSelected ? 'text-[var(--accent-teal)] font-semibold' : 'text-[var(--text-muted)]'].join(' ')}>
              {label}
            </span>
            <span
              className={[
                'w-2 h-2 rounded-full transition-all',
                isSelected
                  ? 'bg-[var(--accent-teal)] shadow-[0_0_8px_rgba(0,229,195,0.6)] scale-125'
                  : hasPeriod
                    ? isClosed
                      ? 'bg-[var(--text-muted)]'
                      : 'bg-[var(--accent-teal)] opacity-50'
                    : 'border border-[var(--border-default)] bg-transparent',
              ].join(' ')}
            />
          </button>
        )
      })}
    </div>
  )
}
