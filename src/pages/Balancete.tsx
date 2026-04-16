import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BalanceteTable } from '@/components/balancete/BalanceteTable'
import { useDRE } from '@/hooks/useDRE'
import { useBalancete } from '@/hooks/useBalancete'
import { usePeriod } from '@/hooks/usePeriod'
import { useCompanyStore } from '@/store/companyStore'
import { formatPeriod } from '@/lib/formatters'

type FilterType = 'all' | 'ativo' | 'passivo' | 'pl' | 'resultado'

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'passivo', label: 'Passivo' },
  { key: 'pl', label: 'PL' },
  { key: 'resultado', label: 'Resultado' },
]

export function Balancete() {
  const company = useCompanyStore((s) => s.selectedCompany())
  const { year, month, period } = usePeriod()
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const { accounts } = useDRE(company?.id ?? null, period?.id ?? null)
  const { entries } = useBalancete(company?.id ?? null, period?.id ?? null)

  return (
    <div className="flex flex-col gap-5 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Balancete</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5 capitalize">
            {formatPeriod(year, month)}
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>
          Exportar PDF
        </Button>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Type filter */}
          <div className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] p-0.5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  'px-3 h-7 rounded-[calc(var(--radius-sm)-2px)] text-xs transition-colors',
                  filter === f.key
                    ? 'bg-[var(--bg-overlay)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conta..."
              className="h-8 pl-8 pr-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors w-52"
            />
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-[var(--text-secondary)]">Configure o plano de contas primeiro.</p>
          </div>
        ) : (
          <BalanceteTable
            accounts={accounts}
            entries={entries}
            filter={filter}
            search={search}
          />
        )}
      </Card>
    </div>
  )
}
