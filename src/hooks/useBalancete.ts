import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { BalanceteEntry } from '@/types/balancete'

export function useBalancete(companyId: string | null, periodId: string | null) {
  const [entries, setEntries] = useState<BalanceteEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!companyId || !periodId) return
    setLoading(true)
    supabase
      .from('balancete_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', periodId)
      .then(({ data }) => {
        setEntries((data as BalanceteEntry[]) ?? [])
        setLoading(false)
      })
  }, [companyId, periodId])

  const upsertEntry = async (entry: Omit<BalanceteEntry, 'id' | 'balance' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('balancete_entries')
      .upsert(entry)
      .select()
      .single()
    if (!error && data) {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.account_id === entry.account_id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = data as BalanceteEntry
          return next
        }
        return [...prev, data as BalanceteEntry]
      })
    }
    return { error }
  }

  return { entries, loading, upsertEntry }
}
