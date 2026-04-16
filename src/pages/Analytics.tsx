import { useState } from 'react'
import { Sparkles, AlertTriangle, AlertCircle, ArrowUpRight } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { UpgradePrompt } from '@/components/plans/UpgradePrompt'
import { useSubscription } from '@/hooks/useSubscription'
import { formatBRL, formatBRLCompact, formatPercent } from '@/lib/formatters'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function generateData(base: number, months: number) {
  return Array.from({ length: months }, (_, i) => ({
    label: MONTHS[i % 12],
    receita: base * (0.8 + Math.random() * 0.5),
    despesa: base * (0.5 + Math.random() * 0.3),
  }))
}

const comparisonData = [
  { label: 'Receita', jan23: 380000, jan24: 420000, fev23: 360000, fev24: 440000 },
  { label: 'CMV', jan23: 160000, jan24: 180000, fev23: 155000, fev24: 185000 },
  { label: 'Luc. Bruto', jan23: 220000, jan24: 240000, fev23: 205000, fev24: 255000 },
  { label: 'Desp. Op.', jan23: 110000, jan24: 120000, fev23: 105000, fev24: 125000 },
  { label: 'Luc. Líq.', jan23: 65000, jan24: 72000, fev23: 60000, fev24: 76000 },
]

const timelineData = generateData(450000, 12)
const timeline2023 = generateData(380000, 12)

const alerts = [
  { id: 1, severity: 'critical', account: 'Desp. Administrativas', variation: 23.5, value: 67000, prevValue: 54200 },
  { id: 2, severity: 'warning', account: 'CMV', variation: 11.2, value: 185000, prevValue: 166400 },
  { id: 3, severity: 'warning', account: 'Desp. Comerciais', variation: 8.7, value: 48300, prevValue: 44400 },
]

export function Analytics() {
  const { canAccess } = useSubscription()
  const [overlay2023, setOverlay2023] = useState(false)

  if (!canAccess('analytics')) {
    return (
      <div className="relative">
        <div className="filter blur-sm pointer-events-none">
          <AnalyticsContent
            canAccessAI={false}
            canAccessAlerts={false}
            overlay2023={false}
            setOverlay2023={() => {}}
          />
        </div>
        <UpgradePrompt feature="Analytics" requiredPlan="professional" overlay />
      </div>
    )
  }

  return (
    <AnalyticsContent
      canAccessAI={canAccess('ai_insights')}
      canAccessAlerts={canAccess('alerts')}
      overlay2023={overlay2023}
      setOverlay2023={setOverlay2023}
    />
  )
}

function AnalyticsContent({
  canAccessAI,
  canAccessAlerts,
  overlay2023,
  setOverlay2023,
}: {
  canAccessAI: boolean
  canAccessAlerts: boolean
  overlay2023: boolean
  setOverlay2023: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-6 animate-fade-slide-up">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Comparativos, tendências e alertas automáticos</p>
      </div>

      {/* Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Períodos</CardTitle>
          <Badge variant="neutral">2023 vs 2024</Badge>
        </CardHeader>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatBRLCompact} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => formatBRL(Number(v))}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Bar dataKey="jan23" name="Jan/23" fill="rgba(0,229,195,0.3)" radius={[3,3,0,0]} />
            <Bar dataKey="jan24" name="Jan/24" fill="var(--accent-teal)" radius={[3,3,0,0]} />
            <Bar dataKey="fev23" name="Fev/23" fill="rgba(255,107,53,0.3)" radius={[3,3,0,0]} />
            <Bar dataKey="fev24" name="Fev/24" fill="var(--accent-orange)" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOverlay2023(!overlay2023)}
              className={[
                'text-xs px-3 h-7 rounded-[var(--radius-sm)] border transition-colors',
                overlay2023
                  ? 'bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] border-[rgba(0,229,195,0.3)]'
                  : 'bg-transparent text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-secondary)]',
              ].join(' ')}
            >
              Sobrepor 2023
            </button>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="label" allowDuplicatedCategory={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatBRLCompact} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [formatBRL(Number(v)), String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Line data={timelineData} type="monotone" dataKey="receita" name="Receita 2024" stroke="var(--accent-teal)" strokeWidth={2} dot={false} animationDuration={1200} />
            <Line data={timelineData} type="monotone" dataKey="despesa" name="Despesa 2024" stroke="var(--accent-orange)" strokeWidth={2} dot={false} animationDuration={1200} />
            {overlay2023 && (
              <>
                <Line data={timeline2023} type="monotone" dataKey="receita" name="Receita 2023" stroke="var(--accent-teal)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line data={timeline2023} type="monotone" dataKey="despesa" name="Despesa 2023" stroke="var(--accent-orange)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Insights */}
      <div className="relative">
        {canAccessAI ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Análise de Tendência</CardTitle>
                <Badge variant="ai" glow>
                  <Sparkles size={10} />
                  IA
                </Badge>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {[
                'Suas despesas administrativas cresceram 23% nos últimos 3 meses, acima da receita (+7%). Considere revisar contratos de serviços recorrentes.',
                'A margem bruta se manteve estável em torno de 54%, indicando controle adequado do CMV.',
                'Receita de serviços cresceu 12% MoM em janeiro — considere expandir essa linha de negócios.',
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <Sparkles size={14} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--text-secondary)]">{insight}</p>
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm">Ver análise completa</Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="relative">
            <Card className="pointer-events-none select-none filter blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Análise de Tendência</CardTitle>
                  <Badge variant="ai">
                    <Sparkles size={10} />
                    IA
                  </Badge>
                </div>
              </CardHeader>
              <div className="h-24 bg-[var(--bg-elevated)] rounded-[var(--radius-md)]" />
            </Card>
            <UpgradePrompt feature="Análise com IA" requiredPlan="professional" overlay />
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="relative">
        {canAccessAlerts ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Alertas de Variação</CardTitle>
                <Badge variant="orange">{alerts.length} alertas</Badge>
              </div>
            </CardHeader>
            <div className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
                >
                  {alert.severity === 'critical' ? (
                    <AlertCircle size={16} className="text-[var(--accent-orange)] shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{alert.account}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatBRL(alert.prevValue)} → {formatBRL(alert.value)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[var(--accent-orange)]">
                    <ArrowUpRight size={14} />
                    {formatPercent(alert.variation)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dre'}>
                    Ver DRE
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="relative">
            <Card className="pointer-events-none select-none filter blur-sm">
              <CardHeader>
                <CardTitle>Alertas de Variação</CardTitle>
              </CardHeader>
              <div className="h-24 bg-[var(--bg-elevated)] rounded-[var(--radius-md)]" />
            </Card>
            <UpgradePrompt feature="Alertas automáticos" requiredPlan="professional" overlay />
          </div>
        )}
      </div>
    </div>
  )
}
