import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminAnalyticsResponse } from '@freestyle/shared';

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  useEffect(() => { adminApi.analytics().then(setData).catch(() => setData(null)); }, []);

  if (!data) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Аналитика</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.cards.map((c) => (
          <div key={c.label} className="bg-white border border-ink-100 rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{c.label}</div>
            <div className="font-display font-extrabold text-3xl text-ink-900 mt-1 tabular-nums">{c.value}</div>
            {c.hint && <div className="text-[11px] text-ink-400 mt-1">{c.hint}</div>}
          </div>
        ))}
      </div>

      <BigChart title="Регистрации, 30 дней" points={data.registrationsLast30d} />
      <BigChart title="Выручка, 30 дней (₽)" points={data.revenueLast30d} />
    </div>
  );
}

function BigChart({ title, points }: { title: string; points: { date: string; value: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const total = points.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-ink-900">{title}</h2>
        <div className="text-sm text-ink-500">Сумма: <b className="text-ink-900 tabular-nums">{total.toLocaleString('ru-RU')}</b></div>
      </div>
      <div className="h-48 flex items-end gap-[3px]">
        {points.map((p) => (
          <div key={p.date} className="flex-1 relative group">
            <div
              className="bg-gradient-to-t from-ink-900 to-ink-700 rounded-sm"
              style={{ height: `${(p.value / max) * 100}%`, minHeight: '2px' }}
              title={`${p.date}: ${p.value.toLocaleString('ru-RU')}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
