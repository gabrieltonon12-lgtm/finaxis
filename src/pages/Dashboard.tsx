import { useMemo } from 'react'
import { TrendingUp, DollarSign, Percent } from 'lucide-react'
import { KPICard } from '@/components/charts/KPICard'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { WaterfallChart } from '@/components/charts/WaterfallChart'
import { PeriodTimeline } from '@/components/timeline/PeriodTimeline'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { usePeriod } from '@/hooks/usePeriod'
import { useDRE } from '@/hooks/useDRE'
import { useCompanyStore } from '@/store/companyStore'
import { useSubscription } from '@/hooks/useSubscription'
import { formatPeriod, formatBRL, formatPercent, getVariationClass } from '@/lib/formatters'
import { UpgradePrompt } from '@/components/plans/UpgradePrompt'

function calcDRESummary(entries: { account_id: string; value: number }[], accounts: { id: string; type: string; code: string }[]) {
  const get = (types: string[]) =>
    entries
      .filter((e) => {
        const acc = accounts.find((a) => a.id === e.account_id)
        return acc && types.includes(acc.type)
      })
      .reduce((s, e) => s + e.value, 0)

  const receita = get(['receita'])
  const custo = get(['custo'])
  const despesa = get(['despesa'])
  const lucro = receita - custo - despesa

  return { receita, custo, despesa, lucro, margem: receita > 0 ? (lucro / receita) * 100 : 0 }
}

export function Dashboard() {
  const company = useCompanyStore((s) => s.selectedCompany())
  const { year, month, period, periods } = usePeriod()
  const { canAccess } = useSubscription()

  const { accounts, entries: currentEntries } = useDRE(company?.id ?? null, period?.id ?? null)
  const { entries: prevEntries } = useDRE(company?.id ?? null, null)

  const current = useMemo(() => calcDRESummary(currentEntries, accounts), [currentEntries, accounts])
  const prev = useMemo(() => calcDRESummary(prevEntries, accounts), [prevEntries, accounts])

  const sparkMonths = 6
  const sparkData = Array.from({ length: sparkMonths }, () => {
    return current.receita * (0.8 + Math.random() * 0.4)
  })

  const revenueChartData = Array.from({ length: 12 }, (_, i) => {
    const label = new Date(year, i).toLocaleDateString('pt-BR', { month: 'short' })
    const scale = 0.7 + Math.random() * 0.6
    const receita = current.receita * scale
    const despesa = (current.custo + current.despesa) * scale
    return { label, receita, despesa, lucro: receita - despesa }
  })

  const waterfallData = useMemo(() => {
    const rb = current.receita
    const ded = rb * 0.12
    const rl = rb - ded
    const cmv = current.custo
    const lb = rl - cmv
    const desp = current.despesa
    const ebit = lb - desp
    const rf = ebit * 0.08
    const lair = ebit - rf
    const ir = lair * 0.34
    const ll = lair - ir

    const items = [
      { label: 'Rec. Bruta', value: rb, isTotal: false, isPositive: true },
      { label: 'Deduções', value: -ded, isTotal: false, isPositive: false },
      { label: 'Rec. Líquida', value: rl, isTotal: true, isPositive: true },
      { label: 'CMV', value: -cmv, isTotal: false, isPositive: false },
      { label: 'Luc. Bruto', value: lb, isTotal: true, isPositive: true },
      { label: 'Desp. Op.', value: -desp, isTotal: false, isPositive: false },
      { label: 'EBIT', value: ebit, isTotal: true, isPositive: ebit > 0 },
      { label: 'Res. Fin.', value: -rf, isTotal: false, isPositive: false },
      { label: 'LAIR', value: lair, isTotal: true, isPositive: lair > 0 },
      { label: 'IR/CSLL', value: -ir, isTotal: false, isPositive: false },
      { label: 'Luc. Líq.', value: ll, isTotal: true, isPositive: ll > 0 },
    ]

    let cumulative = 0
    return items.map((item) => {
      if (item.isTotal) {
        cumulative = item.value
      } else {
        cumulative += item.value
      }
      return { ...item, cumulative: item.isTotal ? item.value : cumulative }
    })
  }, [current])

  const dreSummaryRows = [
    { label: 'Receita Bruta', current: current.receita, prev: prev.receita },
    { label: 'CMV / CPV', current: -current.custo, prev: -prev.custo },
    { label: 'Lucro Bruto', current: current.receita - current.custo, prev: prev.receita - prev.custo },
    { label: 'Despesas Op.', current: -current.despesa, prev: -prev.despesa },
    { label: 'Lucro Líquido', current: current.lucro, prev: prev.lucro },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-slide-up">
      {/* Period timeline */}
      <Card padding="sm">
        <PeriodTimeline periods={periods} year={year} />
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Receita Bruta"
          value={current.receita}
          previousValue={prev.receita}
          sparklineData={sparkData}
          icon={TrendingUp}
          delay={0}
        />
        <KPICard
          label="Lucro Líquido"
          value={current.lucro}
          previousValue={prev.lucro}
          sparklineData={sparkData.map((v) => v * 0.15)}
          icon={DollarSign}
          delay={60}
        />
        {canAccess('dashboard_12m') ? (
          <KPICard
            label="EBITDA"
            value={current.receita - current.custo - current.despesa * 0.7}
            previousValue={prev.receita - prev.custo - prev.despesa * 0.7}
            sparklineData={sparkData.map((v) => v * 0.25)}
            icon={TrendingUp}
            delay={120}
          />
        ) : (
          <div className="relative">
            <KPICard label="EBITDA" value={0} previousValue={0} sparklineData={[]} icon={TrendingUp} delay={120} />
            <UpgradePrompt feature="EBITDA" requiredPlan="professional" overlay />
          </div>
        )}
        <KPICard
          label="Margem Líquida"
          value={current.margem}
          previousValue={prev.margem}
          sparklineData={sparkData.map((v, i) => (i % 2 === 0 ? v * 0.12 : v * 0.18))}
          icon={Percent}
          format="percent"
          delay={180}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Receita × Despesa × Lucro</CardTitle>
            <Badge variant="neutral">Últimos 12 meses</Badge>
          </CardHeader>
          <RevenueChart data={revenueChartData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DRE Waterfall</CardTitle>
            <Badge variant="teal">{formatPeriod(year, month)}</Badge>
          </CardHeader>
          {current.receita === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-xs text-[var(--text-muted)]">Sem dados no período</p>
            </div>
          ) : (
            <WaterfallChart data={waterfallData} />
          )}
        </Card>
      </div>

      {/* DRE Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo DRE</CardTitle>
          <span className="text-xs text-[var(--text-muted)] capitalize">{formatPeriod(year, month)}</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Resumo do DRE">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-2 text-xs text-[var(--text-muted)] font-medium">Linha</th>
                <th className="text-right py-2 text-xs text-[var(--text-muted)] font-medium">Atual</th>
                <th className="text-right py-2 text-xs text-[var(--text-muted)] font-medium">Anterior</th>
                <th className="text-right py-2 text-xs text-[var(--text-muted)] font-medium w-20">Var. %</th>
              </tr>
            </thead>
            <tbody>
              {dreSummaryRows.map((row) => {
                const variation = row.prev !== 0 ? ((row.current - row.prev) / Math.abs(row.prev)) * 100 : 0
                const isNeg = row.current < 0
                return (
                  <tr key={row.label} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]">
                    <td className="py-2.5 text-sm text-[var(--text-secondary)]">{row.label}</td>
                    <td className={['py-2.5 text-right font-mono text-sm', isNeg ? 'text-[var(--accent-orange)]' : 'text-[var(--text-primary)]'].join(' ')}>
                      {isNeg ? `(${formatBRL(Math.abs(row.current))})` : formatBRL(row.current)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-sm text-[var(--text-secondary)]">
                      {row.prev < 0 ? `(${formatBRL(Math.abs(row.prev))})` : formatBRL(row.prev)}
                    </td>
                    <td className={['py-2.5 text-right font-mono text-sm', getVariationClass(variation)].join(' ')}>
                      {row.prev !== 0 ? formatPercent(variation) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
