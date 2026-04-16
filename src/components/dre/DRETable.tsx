import { useState, useCallback } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatBRL, formatPercent, getVariationClass } from '@/lib/formatters'
import type { Account, DREEntry } from '@/types/dre'

interface DRETableProps {
  accounts: Account[]
  currentEntries: DREEntry[]
  previousEntries: DREEntry[]
  onCellEdit?: (accountId: string, value: number) => void
}

interface RowData {
  account: Account
  currentValue: number
  previousValue: number
  children: RowData[]
  level: number
}

function buildTree(accounts: Account[], parentId: string | null, level: number): RowData[] {
  return accounts
    .filter((a) => a.parent_id === parentId)
    .sort((a, b) => a.order_index - b.order_index)
    .map((account) => ({
      account,
      currentValue: 0,
      previousValue: 0,
      children: buildTree(accounts, account.id, level + 1),
      level,
    }))
}

function fillValues(rows: RowData[], current: DREEntry[], previous: DREEntry[]): RowData[] {
  return rows.map((row) => {
    const children = fillValues(row.children, current, previous)
    const directCurrent = current.find((e) => e.account_id === row.account.id)?.value ?? 0
    const directPrevious = previous.find((e) => e.account_id === row.account.id)?.value ?? 0
    const childCurrent = children.reduce((s, c) => s + c.currentValue, 0)
    const childPrevious = children.reduce((s, c) => s + c.previousValue, 0)
    return {
      ...row,
      currentValue: children.length > 0 ? childCurrent : directCurrent,
      previousValue: children.length > 0 ? childPrevious : directPrevious,
      children,
    }
  })
}

const NEGATIVE_TYPES = new Set(['custo', 'despesa'])

export function DRETable({ accounts, currentEntries, previousEntries, onCellEdit }: DRETableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null)

  const tree = fillValues(buildTree(accounts, null, 0), currentEntries, previousEntries)

  const toggle = (id: string) => {
    setEditing(null)
    setExpanded((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleEdit = useCallback(
    (accountId: string, rawValue: string) => {
      const num = parseFloat(rawValue.replace(/[^0-9,-]/g, '').replace(',', '.'))
      if (!isNaN(num)) onCellEdit?.(accountId, num)
      setEditing(null)
    },
    [onCellEdit]
  )

  const renderRows = (rows: RowData[], delay = 0): React.ReactNode[] =>
    rows.flatMap((row, i) => {
      const isNeg = NEGATIVE_TYPES.has(row.account.type)
      const variation =
        row.previousValue !== 0
          ? ((row.currentValue - row.previousValue) / Math.abs(row.previousValue)) * 100
          : 0
      const isOpen = expanded.has(row.account.id)
      const hasChildren = row.children.length > 0
      const isEditing = editing?.id === row.account.id

      const rowEl = (
        <motion.tr
          key={row.account.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.03, duration: 0.15 }}
          className={[
            'border-b border-[var(--border-subtle)] group',
            row.level === 0 ? 'bg-[var(--bg-elevated)]' : 'bg-transparent hover:bg-[var(--bg-elevated)]',
          ].join(' ')}
        >
          {/* Account name */}
          <td className="py-2.5 pr-4" style={{ paddingLeft: `${16 + row.level * 20}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggle(row.account.id)}
                  className="w-4 h-4 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                  aria-label={isOpen ? 'Recolher' : 'Expandir'}
                >
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
              )}
              {!hasChildren && <span className="w-4 shrink-0" />}
              <span
                className={[
                  'font-mono text-xs',
                  row.level === 0 ? 'font-semibold text-[var(--text-primary)] uppercase tracking-wide' : 'text-[var(--text-secondary)]',
                ].join(' ')}
              >
                <span className="text-[var(--text-muted)] mr-2">{row.account.code}</span>
                {row.account.name}
              </span>
            </div>
          </td>

          {/* Current value */}
          <td className="py-2.5 px-4 text-right">
            {isEditing && !hasChildren ? (
              <input
                autoFocus
                defaultValue={String(row.currentValue)}
                className="w-28 text-right bg-[var(--bg-overlay)] border border-[var(--accent-teal)] rounded px-2 py-0.5 text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                onBlur={(e) => handleEdit(row.account.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEdit(row.account.id, (e.target as HTMLInputElement).value)
                  if (e.key === 'Escape') setEditing(null)
                }}
              />
            ) : (
              <span
                onDoubleClick={() => !hasChildren && setEditing({ id: row.account.id, value: String(row.currentValue) })}
                className={[
                  'font-mono text-xs cursor-default select-none',
                  isNeg && row.currentValue > 0 ? 'text-[var(--accent-orange)]' : 'text-[var(--text-primary)]',
                  row.level === 0 ? 'font-semibold' : '',
                  !hasChildren ? 'group-hover:cursor-text' : '',
                ].join(' ')}
              >
                {isNeg && row.currentValue > 0
                  ? `(${formatBRL(row.currentValue)})`
                  : formatBRL(row.currentValue)}
              </span>
            )}
          </td>

          {/* Previous value */}
          <td className="py-2.5 px-4 text-right">
            <span className={['font-mono text-xs text-[var(--text-secondary)]', row.level === 0 ? 'font-semibold' : ''].join(' ')}>
              {isNeg && row.previousValue > 0
                ? `(${formatBRL(row.previousValue)})`
                : formatBRL(row.previousValue)}
            </span>
          </td>

          {/* Variation */}
          <td className="py-2.5 pl-4 pr-5 text-right w-24">
            <span className={['font-mono text-xs', getVariationClass(variation)].join(' ')}>
              {row.previousValue !== 0 ? formatPercent(variation) : '—'}
            </span>
          </td>
        </motion.tr>
      )

      const childRows =
        isOpen && hasChildren
          ? renderRows(row.children, delay + i * 0.03 + 0.03)
          : []

      return [rowEl, ...childRows]
    })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" role="table" aria-label="Demonstração do Resultado do Exercício">
        <thead>
          <tr className="border-b border-[var(--border-default)]">
            <th className="text-left py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Conta
            </th>
            <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-36">
              Período atual
            </th>
            <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-36">
              Período anterior
            </th>
            <th className="text-right py-2.5 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-24">
              Var. %
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>{renderRows(tree)}</AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
