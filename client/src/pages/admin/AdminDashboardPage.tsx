import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users as UsersIcon, Receipt, Newspaper, Activity, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminAnalyticsResponse } from '@freestyle/shared';

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  useEffect(() => { adminApi.analytics().then(setData).catch(() => setData(null)); }, []);

  if (!data) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Обзор</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.cards.map((c) => (
          <div key={c.label} className="bg-white border border-ink-100 rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{c.label}</div>
            <div className="font-display font-extrabold text-3xl text-ink-900 mt-1 tabular-nums">{c.value}</div>
            {c.hint && <div className="text-[11px] text-ink-400 mt-1">{c.hint}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Регистрации, 30 дней" points={data.registrationsLast30d} unit="" />
        <ChartCard title="Выручка, 30 дней" points={data.revenueLast30d} unit="₽" />
      </div>

      <section>
        <h2 className="font-display font-bold text-xl text-ink-900 mb-3">Заказы по статусам</h2>
        {data.bookingsByStatus.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-8 text-center text-ink-500">Пока нет заказов</div>
        ) : (
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {data.bookingsByStatus.map((s) => (
              <div key={s.status} className="bg-white border border-ink-100 rounded-xl p-4 text-center">
                <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-500">{statusLabel(s.status)}</div>
                <div className="font-display font-extrabold text-2xl text-ink-900 mt-1 tabular-nums">{s.count}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ShortcutLink to="/admin/users" icon={UsersIcon} label="Пользователи" />
        <ShortcutLink to="/admin/orders" icon={Receipt} label="Заказы" />
        <ShortcutLink to="/admin/posts" icon={Newspaper} label="Статьи" />
        <ShortcutLink to="/admin/audit" icon={Activity} label="Журнал действий" />
      </section>
    </div>
  );
}

function statusLabel(s: string): string {
  return ({
    pending: 'Ожидает', confirmed: 'Подтвердж.', paid: 'Оплачено',
    completed: 'Завершено', cancelled: 'Отменено', refunded: 'Возврат',
  } as Record<string, string>)[s] ?? s;
}

function ChartCard({ title, points, unit }: { title: string; points: { date: string; value: number }[]; unit: string }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5">
      <h3 className="font-bold text-ink-900">{title}</h3>
      <div className="mt-4 h-32 flex items-end gap-[2px]">
        {points.map((p) => (
          <div key={p.date} className="flex-1 group relative">
            <div
              className="bg-gradient-to-t from-brand-500 to-brand-600 rounded-sm transition-all hover:from-brand-600 hover:to-brand-700"
              style={{ height: `${(p.value / max) * 100}%`, minHeight: '2px' }}
              title={`${p.date}: ${p.value.toLocaleString('ru-RU')}${unit}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10.5px] text-ink-500 flex justify-between">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function ShortcutLink({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link to={to} className="bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 transition-all flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-ink-900 text-white grid place-items-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-bold text-ink-900">{label}</div>
    </Link>
  );
}
