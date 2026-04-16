import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, TrendingUp, BookOpen, BarChart3, Star, ArrowRight,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PLAN_PRICES } from '@/lib/stripe'

const features = [
  {
    icon: TrendingUp,
    title: 'DRE Inteligente',
    desc: 'Visualize cada linha com variação automática, drill-down hierárquico e edição inline.',
  },
  {
    icon: BookOpen,
    title: 'Balancete Interativo',
    desc: 'Drill-down em qualquer conta, verificação de equilíbrio automática e filtros por tipo.',
  },
  {
    icon: BarChart3,
    title: 'Timeline Comparativa',
    desc: 'Sobreponha qualquer período em segundos. Compare 2024 vs 2023 no mesmo gráfico.',
  },
]

const testimonials = [
  {
    name: 'Ana Paula Martins',
    role: 'CFO · Grupo Nexus',
    text: 'Reduzi em 80% o tempo de fechamento mensal. O waterfall do DRE deixou tudo muito mais visual para o board.',
    avatar: 'AP',
  },
  {
    name: 'Ricardo Almeida',
    role: 'Contador · Almeida & Associados',
    text: 'Gerencio 14 empresas com o plano Enterprise. A velocidade de importação e os alertas automáticos são incríveis.',
    avatar: 'RA',
  },
  {
    name: 'Fernanda Costa',
    role: 'Diretora Financeira · Innova Tech',
    text: 'Os insights de IA me ajudaram a identificar um vazamento de despesas que passou 6 meses despercebido.',
    avatar: 'FC',
  },
]

export function Landing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 border-b border-[var(--border-subtle)] bg-[rgba(10,15,30,0.8)] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--accent-teal)] flex items-center justify-center">
            <Zap size={14} className="text-[var(--bg-base)]" />
          </div>
          <span className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>GONT</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Começar grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-teal)] opacity-[0.04] blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          <Badge variant="teal" className="mb-5">
            <Zap size={11} />
            Novo: Análise de tendências com IA
          </Badge>
          <h1
            className="text-5xl font-extrabold leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Seu DRE e Balancete com{' '}
            <span className="text-[var(--accent-teal)]">clareza cirúrgica</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Painel interativo, comparativos mensais e análises automáticas para CFOs e contadores que não têm tempo a perder.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Começar grátis por 14 dias
              </Button>
            </Link>
            <Button variant="secondary" size="lg" icon={<LayoutDashboard size={16} />}>
              Ver demonstração
            </Button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4">Sem cartão de crédito · Cancele quando quiser</p>
        </motion.div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-[var(--border-subtle)] py-4 px-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Usado por <span className="text-[var(--accent-teal)] font-semibold">+500 empresas brasileiras</span> · 98% de satisfação
        </p>
      </div>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-display)' }}>
            Tudo que você precisa para fechar o mês com confiança
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 hover:border-[var(--border-default)] transition-colors"
              >
                <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--accent-teal-dim)] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[var(--accent-teal)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-display)' }}>
            O que nossos clientes dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-[var(--accent-teal)] text-[var(--accent-teal)]" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-teal-dim)] flex items-center justify-center text-xs font-bold text-[var(--accent-teal)]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Preços honestos</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">Comece grátis, faça upgrade quando precisar.</p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={['text-sm', !annual ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'].join(' ')}>Mensal</span>
            <button
              onClick={() => setAnnual((v) => !v)}
              className={['w-11 h-6 rounded-full transition-colors relative', annual ? 'bg-[var(--accent-teal)]' : 'bg-[var(--bg-elevated)]'].join(' ')}
            >
              <span className={['absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', annual ? 'translate-x-6' : 'translate-x-1'].join(' ')} />
            </button>
            <span className={['text-sm', annual ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'].join(' ')}>
              Anual <Badge variant="teal" className="ml-1">-20%</Badge>
            </span>
          </div>
          <div className="flex items-end justify-center gap-6 flex-wrap">
            {(['starter', 'professional', 'enterprise'] as const).map((plan) => (
              <div key={plan} className={['text-center p-5 rounded-[var(--radius-xl)] border', plan === 'professional' ? 'border-[var(--accent-teal)] bg-[var(--bg-surface)] shadow-[var(--accent-teal-glow)]' : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'].join(' ')}>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1 capitalize">{plan}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  R$ {PLAN_PRICES[plan][annual ? 'yearly' : 'monthly']}
                </p>
                <p className="text-xs text-[var(--text-muted)]">/mês</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Começar grátis agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--accent-teal)] flex items-center justify-center">
              <Zap size={11} className="text-[var(--bg-base)]" />
            </div>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>GONT</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">CNPJ 00.000.000/0001-00 · GONT Tecnologia Ltda.</p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href="#" className="hover:text-[var(--text-secondary)]">Privacidade</a>
            <a href="#" className="hover:text-[var(--text-secondary)]">Termos</a>
            <a href="#" className="hover:text-[var(--text-secondary)]">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
