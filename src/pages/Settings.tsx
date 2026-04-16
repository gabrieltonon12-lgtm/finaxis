import { useState } from 'react'
import { Building2, User, Shield } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useCompanyStore } from '@/store/companyStore'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'

export function Settings() {
  const user = useAuthStore((s) => s.user)
  const company = useCompanyStore((s) => s.selectedCompany())
  const updateCompany = useCompanyStore((s) => s.updateCompany)

  const [companyName, setCompanyName] = useState(company?.name ?? '')
  const [cnpj, setCnpj] = useState(company?.cnpj ?? '')
  const [saving, setSaving] = useState(false)

  const handleSaveCompany = async () => {
    if (!company) return
    setSaving(true)
    const { error } = await supabase
      .from('companies')
      .update({ name: companyName, cnpj })
      .eq('id', company.id)
    setSaving(false)
    if (error) {
      toast.error('Erro ao salvar empresa')
    } else {
      updateCompany(company.id, { name: companyName, cnpj })
      toast.success('Empresa atualizada')
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fade-slide-up">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Configurações</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Gerencie sua conta e empresa</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[var(--accent-teal)]" />
            <CardTitle>Empresa</CardTitle>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Nome da empresa</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">CNPJ</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" loading={saving} onClick={handleSaveCompany}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={16} className="text-[var(--accent-teal)]" />
            <CardTitle>Conta</CardTitle>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">E-mail</p>
            <p className="text-sm text-[var(--text-primary)] mt-0.5">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[var(--accent-teal)]" />
            <CardTitle>Plano atual</CardTitle>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">{company?.plan ?? 'Starter'}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {company?.plan === 'starter' && 'R$ 97/mês · 1 empresa'}
              {company?.plan === 'professional' && 'R$ 247/mês · até 5 empresas'}
              {company?.plan === 'enterprise' && 'R$ 597/mês · empresas ilimitadas'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/pricing'}>
            Fazer upgrade
          </Button>
        </div>
      </Card>
    </div>
  )
}
