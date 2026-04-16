import { usePeriodStore } from '@/store/periodStore'

export function usePeriod() {
  const {
    selectedYear,
    selectedMonth,
    periods,
    setSelectedPeriod,
    navigatePeriod,
    selectedPeriod,
  } = usePeriodStore()

  return {
    year: selectedYear,
    month: selectedMonth,
    periods,
    period: selectedPeriod(),
    setSelectedPeriod,
    prevPeriod: () => navigatePeriod('prev'),
    nextPeriod: () => navigatePeriod('next'),
  }
}
