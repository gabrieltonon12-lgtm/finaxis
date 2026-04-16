import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { formatBRLCompact, formatBRL } from '@/lib/formatters'

interface DataPoint {
  label: string
  receita: number
  despesa: number
  lucro: number
}

interface RevenueChartProps {
  data: DataPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div aria-label="Gráfico de receita, despesa e lucro">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5C3" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00E5C3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gDespesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gLucro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E8EDF5" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#E8EDF5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatBRLCompact}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
            formatter={(value, name) => [
              formatBRL(Number(value)),
              String(name).charAt(0).toUpperCase() + String(name).slice(1),
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Area type="monotone" dataKey="receita" stroke="#00E5C3" strokeWidth={2} fill="url(#gReceita)" animationDuration={1200} />
          <Area type="monotone" dataKey="despesa" stroke="#FF6B35" strokeWidth={2} fill="url(#gDespesa)" animationDuration={1200} />
          <Area type="monotone" dataKey="lucro" stroke="#E8EDF5" strokeWidth={2} fill="url(#gLucro)" animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
