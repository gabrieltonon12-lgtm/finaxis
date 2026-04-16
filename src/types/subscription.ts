export type Plan = 'starter' | 'professional' | 'enterprise'

export type Feature =
  | 'dre_manual'
  | 'balancete_manual'
  | 'dashboard_3m'
  | 'export_pdf'
  | 'import_csv'
  | 'dashboard_12m'
  | 'analytics'
  | 'ai_insights'
  | 'alerts'
  | 'export_excel'
  | 'multi_user'
  | 'api_access'
  | 'custom_reports'
  | 'multi_company_unlimited'

export interface Subscription {
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
}

export interface Company {
  id: string
  name: string
  cnpj: string | null
  owner_id: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Period {
  id: string
  company_id: string
  year: number
  month: number
  status: 'draft' | 'closed'
  created_at: string
}
