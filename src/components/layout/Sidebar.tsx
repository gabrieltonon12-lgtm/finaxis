import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  BarChart3,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Zap,
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

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center border-b border-[var(--border-subtle)] px-4 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-teal)] flex items-center justify-center shrink-0">
            <Zap size={16} className="text-[var(--bg-base)]" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-base tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Finaxis
            </motion.span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem
            key={to}
            to={to}
            icon={<Icon size={18} />}
            label={label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-[var(--border-subtle)] flex flex-col gap-0.5">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem
            key={to}
            to={to}
            icon={<Icon size={18} />}
            label={label}
            collapsed={collapsed}
          />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 w-full mt-1 px-3 h-9 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Recolher</span>}
        </button>
      </div>
    </motion.aside>
  )
}

function SidebarItem({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
}) {
  const item = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 h-9 rounded-[var(--radius-sm)] transition-colors text-sm',
          isActive
            ? 'bg-[var(--accent-teal-dim)] text-[var(--accent-teal)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
        ].join(' ')
      }
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return <Tooltip content={label} position="right">{item}</Tooltip>
  }
  return item
}
