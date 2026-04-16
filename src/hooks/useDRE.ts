import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { DREEntry } from '@/types/dre'
import type { Account } from '@/types/dre'

export function useDRE(companyId: string | null, periodId: string | null) {
  const [entries, setEntries] = useState<DREEntry[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!companyId) return
    supabase
      .from('accounts')
      .select('*')
      .eq('company_id', companyId)
      .order('order_index')
      .then(({ data }) => setAccounts((data as Account[]) ?? []))
  }, [companyId])

  useEffect(() => {
    if (!companyId || !periodId) return
    setLoading(true)
    supabase
      .from('dre_entries')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_id', periodId)
      .then(({ data }) => {
        setEntries((data as DREEntry[]) ?? [])
        setLoading(false)
      })
  }, [companyId, periodId])

  const upsertEntry = async (entry: Omit<DREEntry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('dre_entries')
      .upsert(entry)
      .select()
      .single()
    if (!error && data) {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.account_id === entry.account_id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = data as DREEntry
          return next
        }
        return [...prev, data as DREEntry]
      })
    }
    return { error }
  }

  return { entries, accounts, loading, upsertEntry }
}
