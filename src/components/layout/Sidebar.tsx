import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, BookOpen, BarChart3,
  Settings, CreditCard, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dre', icon: TrendingUp, label: 'DRE' },
  { to: '/balancete', icon: BookOpen, label: 'Balancete' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

const bottomItems = [
  { to: '/pricing', icon: CreditCard, label: 'Planos' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const width = collapsed ? 64 : 240

  return (
    <div
      style={{
        width,
        minWidth: width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={16} style={{ color: 'var(--bg-base)' }} />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              GONT
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem key={to} to={to} icon={<Icon size={18} />} label={label} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem key={to} to={to} icon={<Icon size={18} />} label={label} collapsed={collapsed} />
        ))}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginTop: 4, padding: '0 12px', height: 36, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Recolher</span></>}
        </button>
      </div>
    </div>
  )
}

function SidebarItem({ to, icon, label, collapsed }: { to: string; icon: React.ReactNode; label: string; collapsed: boolean }) {
  const item = (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 12px',
        height: 36,
        borderRadius: 6,
        textDecoration: 'none',
        fontSize: 14,
        transition: 'background 0.15s, color 0.15s',
        backgroundColor: isActive ? 'var(--accent-teal-dim)' : 'transparent',
        color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
      })}
      onMouseEnter={e => {
        const el = e.currentTarget
        if (!el.className.includes('active')) el.style.backgroundColor = 'var(--bg-elevated)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        if (!el.getAttribute('aria-current')) el.style.backgroundColor = 'transparent'
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )

  return collapsed ? <Tooltip content={label} position="right">{item}</Tooltip> : item
}
