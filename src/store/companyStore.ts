import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Company } from '@/types/subscription'

interface CompanyState {
  companies: Company[]
  selectedCompanyId: string | null
  setCompanies: (companies: Company[]) => void
  setSelectedCompany: (id: string) => void
  selectedCompany: () => Company | null
  addCompany: (company: Company) => void
  updateCompany: (id: string, data: Partial<Company>) => void
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: [],
      selectedCompanyId: null,
      setCompanies: (companies) =>
        set({
          companies,
          selectedCompanyId: get().selectedCompanyId ?? companies[0]?.id ?? null,
        }),
      setSelectedCompany: (id) => set({ selectedCompanyId: id }),
      selectedCompany: () => {
        const { companies, selectedCompanyId } = get()
        return companies.find((c) => c.id === selectedCompanyId) ?? null
      },
      addCompany: (company) =>
        set((s) => ({
          companies: [...s.companies, company],
          selectedCompanyId: s.selectedCompanyId ?? company.id,
        })),
      updateCompany: (id, data) =>
        set((s) => ({
          companies: s.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
    }),
    { name: 'finaxis-company' }
  )
)
