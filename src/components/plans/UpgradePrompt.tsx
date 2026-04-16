import { Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import type { Plan } from '@/types/subscription'

const PLAN_LABELS: Record<Plan, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

interface UpgradePromptProps {
  feature: string
  requiredPlan: Plan
  overlay?: boolean
  inline?: boolean
}

export function UpgradePrompt({ feature, requiredPlan, overlay = false, inline = false }: UpgradePromptProps) {
  const navigate = useNavigate()

  if (inline) {
    return (
      <Button
        variant="outline"
        size="sm"
        icon={<Lock size={13} />}
        onClick={() => navigate('/pricing')}
        title={`Disponível no plano ${PLAN_LABELS[requiredPlan]}`}
      >
        {PLAN_LABELS[requiredPlan]}
      </Button>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 rounded-[var(--radius-lg)]" style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(2px)' }}>
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center">
            <Lock size={18} className="text-[var(--text-muted)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{feature}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Disponível no plano <span className="text-[var(--accent-teal)]">{PLAN_LABELS[requiredPlan]}</span>
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/pricing')}>
            Fazer upgrade
          </Button>
        </div>
      </div>
    )
  }

  return null
}
