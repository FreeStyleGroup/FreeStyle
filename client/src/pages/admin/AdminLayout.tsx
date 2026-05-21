import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Receipt,
  BarChart3,
  Newspaper,
  Tag,
  Activity,
  Wand2,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/stores/auth';
import { cn } from '@/utils/cn';

interface Item { to: string; label: string; icon: LucideIcon; end?: boolean; editorAllowed?: boolean }

const NAV: Item[] = [
  { to: '/admin',            label: 'Обзор',       icon: LayoutDashboard, end: true },
  { to: '/admin/users',      label: 'Пользователи', icon: UsersIcon },
  { to: '/admin/orders',     label: 'Заказы',       icon: Receipt },
  { to: '/admin/analytics',  label: 'Аналитика',    icon: BarChart3 },
  { to: '/admin/posts',      label: 'Статьи',       icon: Newspaper, editorAllowed: true },
  { to: '/admin/categories', label: 'Категории',    icon: Tag, editorAllowed: true },
  { to: '/admin/factory',    label: 'Контент-завод', icon: Wand2, editorAllowed: true },
  { to: '/admin/audit',      label: 'Журнал',       icon: Activity },
];

export function AdminLayout() {
  const { user } = useAuth();
  const isEditor = user?.role === 'editor';
  const visible = NAV.filter((i) => !isEditor || i.editorAllowed);

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <div className="bg-ink-900 text-white rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-[.2em] font-bold text-white/60">Admin</div>
            <div className="font-display font-extrabold text-xl mt-1">FreeStyle.ru</div>
            <div className="text-[12px] text-white/60 mt-2">
              {user?.role === 'admin' ? 'Полный доступ' : 'Контент-редактор'}
            </div>
          </div>
          <nav className="bg-white border border-ink-100 rounded-2xl p-2 shadow-sm">
            {visible.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-surface-2 hover:text-ink-900',
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
