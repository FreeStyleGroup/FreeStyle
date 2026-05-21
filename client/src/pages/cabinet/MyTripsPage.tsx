import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { BookingSummaryDto } from '@freestyle/shared';

const STATUS_TAG: Record<string, { label: string; tone: string }> = {
  pending:   { label: 'Ожидает',      tone: 'bg-ink-100 text-ink-700' },
  confirmed: { label: 'Подтверждено', tone: 'bg-mint-100 text-mint-700' },
  paid:      { label: 'Оплачено',     tone: 'bg-mint-500/15 text-mint-700' },
  completed: { label: 'Завершено',    tone: 'bg-ink-100 text-ink-500' },
  cancelled: { label: 'Отменено',     tone: 'bg-coral-100 text-coral-700' },
  refunded:  { label: 'Возврат',      tone: 'bg-amber-100 text-amber-700' },
};

export function MyTripsPage() {
  const [items, setItems] = useState<BookingSummaryDto[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    cabinetApi.listBookings().then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  const filtered = items.filter((b) => {
    if (filter === 'active')     return b.status === 'paid' || b.status === 'confirmed';
    if (filter === 'completed')  return b.status === 'completed';
    if (filter === 'cancelled')  return b.status === 'cancelled' || b.status === 'refunded';
    return true;
  });

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Мои поездки</h1>

      <div className="inline-flex bg-surface-2 rounded-xl p-1.5">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === f ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            {{ all: 'Все', active: 'Активные', completed: 'Завершённые', cancelled: 'Отменённые' }[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Plane className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">{items.length === 0 ? 'Здесь будут ваши бронирования.' : 'По этому фильтру ничего нет.'}</p>
          <Link to="/" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm">
            Найти поездку
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const tag = STATUS_TAG[b.status] ?? STATUS_TAG.pending;
            return (
              <div key={b.id} className="bg-white border border-ink-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg text-ink-900 truncate">{b.title}</div>
                  <div className="text-[12.5px] text-ink-500 mt-0.5">
                    №{b.publicId} · {new Date(b.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`inline-flex px-2.5 py-1 rounded-full text-[10.5px] uppercase font-bold tracking-wider ${tag.tone}`}>
                    {tag.label}
                  </div>
                  <div className="font-display font-extrabold text-xl text-ink-900 tabular-nums mt-1.5">
                    {Number(b.amount).toLocaleString('ru-RU')} {b.currency.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
