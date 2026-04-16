import { useState } from 'react'
import { Check, X, Zap, Star, Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PLAN_PRICES } from '@/lib/stripe'
import { useCompanyStore } from '@/store/companyStore'
import type { Plan } from '@/types/subscription'

const plans = [
  {
    key: 'starter' as Plan,
    name: 'Starter',
    icon: Zap,
    description: 'Para contadores e PMEs iniciando',
    features: [
      { label: '1 empresa', included: true },
      { label: 'DRE e Balancete manual', included: true },
      { label: 'Dashboard últimos 3 meses', included: true },
      { label: 'Exportação PDF', included: true },
      { label: 'Suporte por e-mail', included: true },
      { label: 'Importação CSV/Excel', included: false },
      { label: 'Análise com IA', included: false },
      { label: 'Alertas automáticos', included: false },
      { label: 'Multi-empresa', included: false },
    ],
    cta: 'Começar agora',
  },
  {
    key: 'professional' as Plan,
    name: 'Professional',
    icon: Star,
    description: 'Para escritórios de contabilidade',
    popular: true,
    features: [
      { label: 'Até 5 empresas', included: true },
      { label: 'DRE e Balancete completo', included: true },
      { label: 'Dashboard histórico 12 meses', included: true },
      { label: 'Exportação PDF + Excel', included: true },
      { label: 'Importação CSV/Excel', included: true },
      { label: 'Análise de tendências com IA', included: true },
      { label: 'Alertas de variação automáticos', included: true },
      { label: 'Comparativo entre períodos', included: true },
      { label: 'Suporte prioritário', included: true },
    ],
    cta: 'Assinar Professional',
  },
  {
    key: 'enterprise' as Plan,
    name: 'Enterprise',
    icon: Building,
    description: 'Para grandes operações contábeis',
    features: [
      { label: 'Empresas ilimitadas', included: true },
      { label: 'Tudo do Professional', included: true },
      { label: 'Multi-usuário com permissões', included: true },
      { label: 'API de integração (ERP)', included: true },
      { label: 'Relatórios customizáveis', included: true },
      { label: 'Onboarding dedicado', included: true },
      { label: 'Suporte via WhatsApp + SLA', included: true },
      { label: 'Exportação avançada', included: true },
      { label: 'Acesso API REST', included: true },
    ],
    cta: 'Falar com vendas',
  },
]

const faqs = [
  { q: 'Posso testar gratuitamente?', a: 'Sim! Todos os planos têm 14 dias de trial gratuito sem necessidade de cartão de crédito.' },
  { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim. O upgrade é instantâneo e o downgrade entra em vigor no próximo ciclo de cobrança.' },
  { q: 'Os dados ficam seguros?', a: 'Utilizamos Supabase com RLS ativo em todas as tabelas. Nenhum usuário acessa dados de outra empresa.' },
  { q: 'O desconto anual é automático?', a: 'Sim. Ao selecionar o plano anual, você economiza 20% e a cobrança é feita uma vez por ano.' },
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim. Sem multa de cancelamento. Você pode cancelar direto pelo portal do cliente.' },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const currentPlan = useCompanyStore((s) => s.selectedCompany())?.plan

  const handleCheckout = (plan: Plan) => {
    if (plan === 'enterprise') {
      window.location.href = 'mailto:vendas@gont.com.br'
      return
    }
    // Stripe checkout flow handled server-side
    console.log('checkout', plan, annual ? 'yearly' : 'monthly')
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-fade-slide-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
          Planos simples e transparentes
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Comece grátis por 14 dias. Sem cartão de crédito.
        </p>

        {/* Toggle anual/mensal */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={['text-sm', !annual ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'].join(' ')}>Mensal</span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className={[
              'w-11 h-6 rounded-full transition-colors relative',
              annual ? 'bg-[var(--accent-teal)]' : 'bg-[var(--bg-elevated)]',
            ].join(' ')}
            aria-label="Alternar cobrança anual"
          >
            <span className={['absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', annual ? 'translate-x-6' : 'translate-x-1'].join(' ')} />
          </button>
          <span className={['text-sm', annual ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'].join(' ')}>
            Anual
            <Badge variant="teal" className="ml-2">-20%</Badge>
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = PLAN_PRICES[plan.key][annual ? 'yearly' : 'monthly']
          const Icon = plan.icon
          const isCurrent = currentPlan === plan.key

          return (
            <div
              key={plan.key}
              className={[
                'relative flex flex-col rounded-[var(--radius-xl)] border p-6 transition-all',
                plan.popular
                  ? 'border-[var(--accent-teal)] bg-[var(--bg-surface)] scale-[1.02] shadow-[var(--accent-teal-glow)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-default)]',
              ].join(' ')}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="teal" glow>⭐ Mais popular</Badge>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={['w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center', plan.popular ? 'bg-[var(--accent-teal)]' : 'bg-[var(--bg-elevated)]'].join(' ')}>
                  <Icon size={18} className={plan.popular ? 'text-[var(--bg-base)]' : 'text-[var(--accent-teal)]'} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{plan.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{plan.description}</p>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  R$ {price}
                </span>
                <span className="text-sm text-[var(--text-muted)]">/mês</span>
                {annual && (
                  <p className="text-xs text-[var(--accent-teal)] mt-0.5">Cobrado anualmente</p>
                )}
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    {f.included
                      ? <Check size={14} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
                      : <X size={14} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                    }
                    <span className={f.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isCurrent ? 'secondary' : plan.popular ? 'primary' : 'outline'}
                fullWidth
                disabled={isCurrent}
                onClick={() => handleCheckout(plan.key)}
              >
                {isCurrent ? 'Plano atual' : plan.cta}
              </Button>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 text-center" style={{ fontFamily: 'var(--font-display)' }}>
          Perguntas frequentes
        </h2>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                {faq.q}
                <span className={['text-[var(--text-muted)] transition-transform', openFaq === i ? 'rotate-180' : ''].join(' ')}>▾</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
