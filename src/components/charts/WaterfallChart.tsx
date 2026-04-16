import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts'
import { formatBRLCompact, formatBRL } from '@/lib/formatters'

interface WaterfallItem {
  label: string
  value: number
  cumulative: number
  isTotal: boolean
  isPositive: boolean
}

interface WaterfallChartProps {
  data: WaterfallItem[]
}

export function WaterfallChart({ data }: WaterfallChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    base: d.isTotal ? 0 : Math.min(d.cumulative - d.value, d.cumulative),
    bar: Math.abs(d.value),
  }))

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: WaterfallItem }> }) => {
    if (!active || !payload?.length) return null
    const item = payload[0].payload
    return (
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-3 text-xs shadow-[var(--shadow-md)]">
        <p className="text-[var(--text-secondary)] mb-1">{item.label}</p>
        <p className={['font-semibold font-mono', item.isPositive ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-orange)]'].join(' ')}>
          {item.isPositive ? '+' : '-'}{formatBRL(Math.abs(item.value))}
        </p>
        <p className="text-[var(--text-muted)] mt-0.5">Total: {formatBRL(item.cumulative)}</p>
      </div>
    )
  }

  return (
    <div aria-label="Gráfico waterfall do DRE">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            angle={-25}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tickFormatter={formatBRLCompact}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine y={0} stroke="var(--border-default)" />
          {/* invisible base bar */}
          <Bar dataKey="base" stackId="a" fill="transparent" />
          {/* visible bar */}
          <Bar dataKey="bar" stackId="a" radius={[3, 3, 0, 0]} animationDuration={1200}>
            {chartData.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.isTotal ? 'var(--text-secondary)' : entry.isPositive ? 'var(--accent-teal)' : 'var(--accent-orange)'}
                fillOpacity={entry.isTotal ? 0.5 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function CartesianGrid() {
  return (
    <svg>
      <line stroke="var(--border-subtle)" strokeDasharray="3 3" />
    </svg>
  )
}
