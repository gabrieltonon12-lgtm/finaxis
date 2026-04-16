import { useCompanyStore } from '@/store/companyStore'
import type { Feature, Plan } from '@/types/subscription'

const PLAN_FEATURES: Record<Plan, Feature[]> = {
  starter: ['dre_manual', 'balancete_manual', 'dashboard_3m', 'export_pdf'],
  professional: [
    'dre_manual', 'balancete_manual', 'dashboard_3m', 'export_pdf',
    'import_csv', 'dashboard_12m', 'analytics', 'ai_insights',
    'alerts', 'export_excel',
  ],
  enterprise: [
    'dre_manual', 'balancete_manual', 'dashboard_3m', 'export_pdf',
    'import_csv', 'dashboard_12m', 'analytics', 'ai_insights',
    'alerts', 'export_excel',
    'multi_user', 'api_access', 'custom_reports', 'multi_company_unlimited',
  ],
}

export function useSubscription() {
  const company = useCompanyStore((s) => s.selectedCompany())
  const plan: Plan = company?.plan ?? 'starter'

  const canAccess = (feature: Feature): boolean =>
    PLAN_FEATURES[plan].includes(feature)

  const requiredPlanFor = (feature: Feature): Plan => {
    if (PLAN_FEATURES.starter.includes(feature)) return 'starter'
    if (PLAN_FEATURES.professional.includes(feature)) return 'professional'
    return 'enterprise'
  }

  return { plan, canAccess, requiredPlanFor }
}
