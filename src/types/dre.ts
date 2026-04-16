export interface Account {
  id: string
  company_id: string
  code: string
  name: string
  type: 'receita' | 'custo' | 'despesa' | 'ativo' | 'passivo' | 'pl'
  parent_id: string | null
  order_index: number
  children?: Account[]
}

export interface DREEntry {
  id: string
  company_id: string
  period_id: string
  account_id: string
  value: number
  description: string | null
  created_at: string
}

export interface DRERow {
  account: Account
  value: number
  previousValue: number
  variation: number
  variationPercent: number
  children: DRERow[]
  isExpanded: boolean
  isTotal: boolean
  isMargin: boolean
}

export interface DRESummary {
  receitaBruta: number
  deducoes: number
  receitaLiquida: number
  cmv: number
  lucroBruto: number
  margemBruta: number
  despesasOperacionais: number
  ebit: number
  resultadoFinanceiro: number
  lair: number
  ir: number
  lucroLiquido: number
  margemLiquida: number
}
