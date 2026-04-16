import { useState } from 'react'
import { ChevronRight, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatBRL } from '@/lib/formatters'
import type { Account } from '@/types/dre'
import type { BalanceteEntry } from '@/types/balancete'
import { Badge } from '@/components/ui/Badge'

interface Props {
  accounts: Account[]
  entries: BalanceteEntry[]
  filter?: 'all' | 'ativo' | 'passivo' | 'pl' | 'resultado'
  search?: string
}

interface BalRow {
  account: Account
  level: number
  debit: number
  credit: number
  balance: number
  children: BalRow[]
}

function buildBalTree(accounts: Account[], entries: BalanceteEntry[], parentId: string | null, level: number): BalRow[] {
  return accounts
    .filter((a) => a.parent_id === parentId)
    .sort((a, b) => a.order_index - b.order_index)
    .map((account) => {
      const children = buildBalTree(accounts, entries, account.id, level + 1)
      const direct = entries.find((e) => e.account_id === account.id)
      const childDebit = children.reduce((s, c) => s + c.debit, 0)
      const childCredit = children.reduce((s, c) => s + c.credit, 0)
      const debit = children.length > 0 ? childDebit : (direct?.debit ?? 0)
      const credit = children.length > 0 ? childCredit : (direct?.credit ?? 0)
      return { account, level, debit, credit, balance: debit - credit, children }
    })
}

function filterTree(rows: BalRow[], filter: Props['filter'], search: string): BalRow[] {
  return rows
    .map((row) => ({
      ...row,
      children: filterTree(row.children, filter, search),
    }))
    .filter((row) => {
      const matchFilter =
        !filter || filter === 'all' || row.account.type === filter ||
        (filter === 'resultado' && ['receita', 'custo', 'despesa'].includes(row.account.type))
      const matchSearch =
        !search ||
        row.account.name.toLowerCase().includes(search.toLowerCase()) ||
        row.account.code.includes(search) ||
        row.children.length > 0
      return matchFilter && matchSearch
    })
}

export function BalanceteTable({ accounts, entries, filter = 'all', search = '' }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const tree = filterTree(buildBalTree(accounts, entries, null, 0), filter, search)

  const totalAtivo = tree
    .filter((r) => r.account.type === 'ativo')
    .reduce((s, r) => s + r.balance, 0)
  const totalPassivoePL = tree
    .filter((r) => ['passivo', 'pl'].includes(r.account.type))
    .reduce((s, r) => s + r.balance, 0)
  const isBalanced = Math.abs(totalAtivo - totalPassivoePL) < 0.01

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const renderRows = (rows: BalRow[]): React.ReactNode[] =>
    rows.flatMap((row, i) => {
      const isOpen = expanded.has(row.account.id)
      const hasChildren = row.children.length > 0

      const rowEl = (
        <motion.tr
          key={row.account.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.02 }}
          className={[
            'border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]',
            row.level === 0 ? 'bg-[var(--bg-elevated)]' : '',
          ].join(' ')}
        >
          <td className="py-2.5 pr-4" style={{ paddingLeft: `${16 + row.level * 20}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  onClick={() => toggle(row.account.id)}
                  className="w-4 h-4 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
                >
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
              ) : (
                <span className="w-4 shrink-0" />
              )}
              <span className={['font-mono text-xs', row.level === 0 ? 'font-semibold text-[var(--text-primary)] uppercase' : 'text-[var(--text-secondary)]'].join(' ')}>
                <span className="text-[var(--text-muted)] mr-2">{row.account.code}</span>
                {row.account.name}
              </span>
            </div>
          </td>
          <td className="py-2.5 px-4 text-right font-mono text-xs text-[var(--text-secondary)]">
            {formatBRL(row.debit)}
          </td>
          <td className="py-2.5 px-4 text-right font-mono text-xs text-[var(--text-secondary)]">
            {formatBRL(row.credit)}
          </td>
          <td className={['py-2.5 px-4 text-right font-mono text-xs font-semibold', row.balance >= 0 ? 'text-[var(--text-primary)]' : 'text-[var(--accent-orange)]'].join(' ')}>
            {formatBRL(row.balance)}
          </td>
        </motion.tr>
      )

      const childRows = isOpen && hasChildren ? renderRows(row.children) : []
      return [rowEl, ...childRows]
    })

  return (
    <div>
      {/* Equilíbrio badge */}
      <div className="flex items-center gap-2 mb-4">
        {isBalanced ? (
          <Badge variant="teal">
            <CheckCircle size={12} />
            Balancete equilibrado
          </Badge>
        ) : (
          <Badge variant="orange">
            <AlertCircle size={12} />
            Ativo ≠ Passivo + PL
          </Badge>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table" aria-label="Balancete de verificação">
          <thead>
            <tr className="border-b border-[var(--border-default)]">
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Conta</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-32">Débitos</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-32">Créditos</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-32">Saldo</th>
            </tr>
          </thead>
          <tbody>{renderRows(tree)}</tbody>
        </table>
      </div>
    </div>
  )
}
