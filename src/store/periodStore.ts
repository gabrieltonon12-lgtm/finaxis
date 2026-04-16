import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Period } from '@/types/subscription'

interface PeriodState {
  periods: Period[]
  selectedYear: number
  selectedMonth: number
  setPeriods: (periods: Period[]) => void
  setSelectedPeriod: (year: number, month: number) => void
  navigatePeriod: (direction: 'prev' | 'next') => void
  selectedPeriod: () => Period | null
  addPeriod: (period: Period) => void
  updatePeriod: (id: string, data: Partial<Period>) => void
}

const now = new Date()

export const usePeriodStore = create<PeriodState>()(
  persist(
    (set, get) => ({
      periods: [],
      selectedYear: now.getFullYear(),
      selectedMonth: now.getMonth() + 1,
      setPeriods: (periods) => set({ periods }),
      setSelectedPeriod: (year, month) => set({ selectedYear: year, selectedMonth: month }),
      navigatePeriod: (direction) => {
        const { selectedYear, selectedMonth } = get()
        let y = selectedYear
        let m = selectedMonth
        if (direction === 'prev') {
          m--
          if (m < 1) { m = 12; y-- }
        } else {
          m++
          if (m > 12) { m = 1; y++ }
        }
        set({ selectedYear: y, selectedMonth: m })
      },
      selectedPeriod: () => {
        const { periods, selectedYear, selectedMonth } = get()
        return periods.find(
          (p) => p.year === selectedYear && p.month === selectedMonth
        ) ?? null
      },
      addPeriod: (period) => set((s) => ({ periods: [...s.periods, period] })),
      updatePeriod: (id, data) =>
        set((s) => ({
          periods: s.periods.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
    }),
    { name: 'gont-period' }
  )
)
