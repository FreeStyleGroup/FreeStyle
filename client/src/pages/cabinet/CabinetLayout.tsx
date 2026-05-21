import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  Heart,
  UserCircle2,
  FileText,
  Wallet,
  Map as MapIcon,
  Sparkles,
  Gift,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/stores/auth';
import { cn } from '@/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/cabinet',                 label: 'Главная',         icon: LayoutDashboard, end: true },
  { to: '/cabinet/trips',           label: 'Мои поездки',     icon: Plane },
  { to: '/cabinet/favorites',       label: 'Избранное',       icon: Heart },
  { to: '/cabinet/documents',       label: 'Документы',       icon: FileText },
  { to: '/cabinet/wallet',          label: 'Travel Wallet',   icon: Wallet },
  { to: '/cabinet/timeline',        label: 'Карта поездок',   icon: MapIcon },
  { to: '/cabinet/recommendations', label: 'Рекомендации',    icon: Sparkles },
  { to: '/cabinet/referral',        label: 'Приведи друга',   icon: Gift },
  { to: '/cabinet/profile',         label: 'Профиль',         icon: UserCircle2 },
  { to: '/cabinet/settings',        label: 'Настройки',       icon: Settings },
];

const TIER_LABEL: Record<string, { name: string; gradient: string }> = {
  bronze:   { name: 'Bronze',   gradient: 'from-amber-700 to-amber-900' },
  silver:   { name: 'Silver',   gradient: 'from-ink-400 to-ink-600' },
  gold:     { name: 'Gold',     gradient: 'from-amber-400 to-amber-600' },
  platinum: { name: 'Platinum', gradient: 'from-violet-400 to-violet-600' },
};

export function CabinetLayout() {
  const { user } = useAuth();
  const tier = user ? TIER_LABEL[user.tier] : TIER_LABEL.bronze;

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-3">
          {user && (
            <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-full text-white grid place-items-center font-display font-extrabold text-lg bg-gradient-to-br',
                  tier.gradient,
                )}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-ink-900 truncate">{user.name}</div>
                  <div className="text-[12px] text-ink-500 truncate">{user.email}</div>
                </div>
              </div>
              <div className={cn(
                'mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r',
                tier.gradient,
              )}>
                <Sparkles className="w-3 h-3" />
                {tier.name} статус
              </div>
            </div>
          )}

          <nav className="bg-white border border-ink-100 rounded-2xl p-2 shadow-sm">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-surface-2 hover:text-ink-900',
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
