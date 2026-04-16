export const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatBRLCompact = (value: number): string => {
  if (Math.abs(value) >= 1_000_000)
    return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000)
    return `R$ ${(value / 1_000).toFixed(1)}K`
  return formatBRL(value)
}

export const formatPercent = (value: number): string =>
  `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

export const formatPeriod = (year: number, month: number): string =>
  new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

export const formatPeriodShort = (year: number, month: number): string =>
  new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })

export const formatCNPJ = (cnpj: string): string =>
  cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')

export const formatDREValue = (value: number, isNegative = false): string => {
  const formatted = formatBRL(Math.abs(value))
  return isNegative ? `(${formatted})` : formatted
}

export const getVariationClass = (value: number): string => {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-secondary'
}
