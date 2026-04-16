import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useCompanyStore } from '@/store/companyStore'
import { usePeriodStore } from '@/store/periodStore'
import { toast } from '@/components/ui/Toast'
import type { Company, Period } from '@/types/subscription'

const STEPS = ['Empresa', 'Período inicial', 'Plano de contas', 'Concluído']

const SEGMENTS = ['Comércio', 'Serviços', 'Indústria', 'Tecnologia', 'Saúde', 'Educação', 'Outro']
const REGIMES = ['Simples Nacional', 'Lucro Presumido', 'Lucro Real']

export function Onboarding() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { addCompany } = useCompanyStore()
  const { addPeriod, setSelectedPeriod } = usePeriodStore()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [segment, setSegment] = useState(SEGMENTS[0])
  const [regime, setRegime] = useState(REGIMES[0])

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const handleCreateCompany = async () => {
    if (!companyName.trim()) { toast.error('Informe o nome da empresa'); return }
    setLoading(true)

    const { data: company, error } = await supabase
      .from('companies')
      .insert({ name: companyName, cnpj, owner_id: user!.id, plan: 'starter' })
      .select()
      .single()

    if (error || !company) { toast.error('Erro ao criar empresa'); setLoading(false); return }

    addCompany(company as Company)

    const { data: period } = await supabase
      .from('periods')
      .insert({ company_id: company.id, year, month, status: 'draft' })
      .select()
      .single()

    if (period) {
      addPeriod(period as Period)
      setSelectedPeriod(year, month)
    }

    setLoading(false)
    setStep(2)
  }

  const handleFinish = () => navigate('/dashboard')

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--accent-teal)] flex items-center justify-center">
            <Zap size={16} className="text-[var(--bg-base)]" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>Finaxis</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  i < step ? 'bg-[var(--accent-teal)] text-[var(--bg-base)]' : i === step ? 'bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] border border-[var(--accent-teal)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]',
                ].join(' ')}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={['text-xs hidden sm:block', i === step ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'].join(' ')}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={['w-8 h-px mb-4', i < step ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border-subtle)]'].join(' ')} />
              )}
            </div>
          ))}
        </div>

        <Card>
          {/* Step 0 — Empresa */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Dados da empresa</h2>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Nome da empresa *</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  placeholder="Ex: Empresa ABC Ltda."
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">CNPJ</label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Segmento</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  >
                    {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Regime tributário</label>
                  <select
                    value={regime}
                    onChange={(e) => setRegime(e.target.value)}
                    className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  >
                    {REGIMES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <Button variant="primary" fullWidth onClick={() => setStep(1)}>
                Próximo
              </Button>
            </div>
          )}

          {/* Step 1 — Período inicial */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Período inicial</h2>
              <p className="text-sm text-[var(--text-secondary)]">A partir de qual mês você quer começar a registrar?</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Mês</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Ano</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
                  >
                    {[2022, 2023, 2024, 2025, 2026].map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" fullWidth onClick={() => setStep(0)}>Voltar</Button>
                <Button variant="primary" fullWidth loading={loading} onClick={handleCreateCompany}>
                  Criar empresa
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Plano de contas */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Plano de contas</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Inicialize com o plano de contas padrão brasileiro ou importe o seu.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--accent-teal)] bg-[var(--accent-teal-dim)] text-left hover:bg-[rgba(0,229,195,0.12)] transition-colors"
                >
                  <Check size={16} className="text-[var(--accent-teal)] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Usar template padrão BR</p>
                    <p className="text-xs text-[var(--text-secondary)]">Plano de contas com estrutura DRE e Balancete completos</p>
                  </div>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] text-left hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border border-[var(--border-default)] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Começar do zero</p>
                    <p className="text-xs text-[var(--text-secondary)]">Adicione manualmente as contas que precisar</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Concluído */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-teal-dim)] flex items-center justify-center">
                <Check size={28} className="text-[var(--accent-teal)]" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                Empresa configurada!
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Tudo pronto. Agora você pode começar a registrar seu DRE e Balancete.
              </p>
              <Button variant="primary" fullWidth onClick={handleFinish} iconRight={<Zap size={16} />}>
                Ir para o Dashboard
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
