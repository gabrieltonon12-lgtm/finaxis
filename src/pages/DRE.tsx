import { Upload, Download, FileSpreadsheet, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DRETable } from '@/components/dre/DRETable'
import { useDRE } from '@/hooks/useDRE'
import { usePeriod } from '@/hooks/usePeriod'
import { useCompanyStore } from '@/store/companyStore'
import { useSubscription } from '@/hooks/useSubscription'
import { formatPeriod } from '@/lib/formatters'
import { toast } from '@/components/ui/Toast'
import { UpgradePrompt } from '@/components/plans/UpgradePrompt'

export function DRE() {
  const company = useCompanyStore((s) => s.selectedCompany())
  const { year, month, period } = usePeriod()
  const prevYear = month === 1 ? year - 1 : year
  const prevMonth = month === 1 ? 12 : month - 1
  const { canAccess } = useSubscription()

  const { accounts, entries: currentEntries, upsertEntry } = useDRE(
    company?.id ?? null,
    period?.id ?? null
  )

  const { entries: previousEntries } = useDRE(company?.id ?? null, null)

  const handleCellEdit = async (accountId: string, value: number) => {
    if (!company?.id || !period?.id) {
      toast.error('Selecione um período para editar')
      return
    }
    const { error } = await upsertEntry({
      company_id: company.id,
      period_id: period.id,
      account_id: accountId,
      value,
      description: null,
    })
    if (error) toast.error('Erro ao salvar valor')
    else toast.success('Valor atualizado')
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">DRE</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5 capitalize">
            {formatPeriod(year, month)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canAccess('import_csv') ? (
            <Button variant="secondary" size="sm" icon={<Upload size={14} />}>
              Importar CSV
            </Button>
          ) : (
            <UpgradePrompt feature="Importação CSV" requiredPlan="professional" inline />
          )}
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            Exportar PDF
          </Button>
          {canAccess('export_excel') && (
            <Button variant="secondary" size="sm" icon={<FileSpreadsheet size={14} />}>
              Excel
            </Button>
          )}
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            Adicionar linha
          </Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="text-xs text-[var(--text-secondary)]">
            Duplo clique em qualquer valor para editar
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-teal)]" />
              <span className="text-[var(--text-secondary)]">Período atual: {formatPeriod(year, month)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">Comparativo: {formatPeriod(prevYear, prevMonth)}</span>
            </span>
          </div>
        </div>
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-[var(--text-secondary)]">Nenhum plano de contas configurado.</p>
            <Button variant="primary" size="sm" onClick={() => window.location.href = '/onboarding'}>
              Configurar plano de contas
            </Button>
          </div>
        ) : (
          <DRETable
            accounts={accounts}
            currentEntries={currentEntries}
            previousEntries={previousEntries}
            onCellEdit={handleCellEdit}
          />
        )}
      </Card>
    </div>
  )
}
