export interface BalanceteEntry {
  id: string
  company_id: string
  period_id: string
  account_id: string
  debit: number
  credit: number
  balance: number
  created_at: string
}

export interface BalanceteRow {
  account_id: string
  code: string
  name: string
  type: string
  level: number
  saldo_anterior: number
  debits: number
  credits: number
  saldo_atual: number
  children: BalanceteRow[]
  isExpanded: boolean
}
