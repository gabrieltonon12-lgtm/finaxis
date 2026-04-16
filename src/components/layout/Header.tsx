import { ChevronDown, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useCompanyStore } from '@/store/companyStore'
import { usePeriodStore } from '@/store/periodStore'
import { supabase } from '@/lib/supabase'
import { formatPeriod } from '@/lib/formatters'
import { Badge } from '@/components/ui/Badge'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const { companies, selectedCompanyId, setSelectedCompany, selectedCompany } = useCompanyStore()
  const { selectedYear, selectedMonth, navigatePeriod, selectedPeriod } = usePeriodStore()
  const company = selectedCompany()
  const period = selectedPeriod()

  const [companyOpen, setCompanyOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    useAuthStore.getState().signOut()
  }

  return (
    <header className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] gap-4 shrink-0">
      {/* Company selector */}
      <div className="relative">
        <button
          onClick={() => setCompanyOpen((v) => !v)}
          className="flex items-center gap-2 px-3 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
        >
          <span className="max-w-[140px] truncate">{company?.name ?? 'Selecionar empresa'}</span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </button>
        {companyOpen && companies.length > 1 && (
          <div className="absolute top-10 left-0 z-20 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] py-1 min-w-[180px]">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCompany(c.id); setCompanyOpen(false) }}
                className={[
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  c.id === selectedCompanyId
                    ? 'text-[var(--accent-teal)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]',
                ].join(' ')}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigatePeriod('prev')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Período anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 text-sm font-medium text-[var(--text-primary)] capitalize min-w-[130px] text-center">
          {formatPeriod(selectedYear, selectedMonth)}
        </span>
        <button
          onClick={() => navigatePeriod('next')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Próximo período"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Period status */}
      {period && (
        <Badge variant={period.status === 'closed' ? 'neutral' : 'teal'}>
          {period.status === 'closed' ? 'Fechado' : 'Rascunho'}
        </Badge>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setUserOpen((v) => !v)}
          className="flex items-center gap-2 px-3 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[var(--accent-teal-dim)] flex items-center justify-center">
            <User size={13} className="text-[var(--accent-teal)]" />
          </div>
          <span className="text-sm text-[var(--text-secondary)] max-w-[140px] truncate">
            {user?.email ?? ''}
          </span>
          <ChevronDown size={13} className="text-[var(--text-muted)]" />
        </button>
        {userOpen && (
          <div className="absolute top-10 right-0 z-20 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] py-1 min-w-[160px]">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-orange)] hover:bg-[var(--bg-overlay)] transition-colors flex items-center gap-2"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
