import { useEffect, useState } from 'react';
import { Map as MapIcon, Plane, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { BookingSummaryDto } from '@freestyle/shared';

/**
 * Trip Timeline — карта мира посещённых стран + хронология.
 * MVP: только хронологический список + грид-плашек по странам;
 * интерактивная SVG-карта будет следующей итерацией (react-simple-maps),
 * чтобы не тащить +200KB на момент Phase 3.
 */
export function TimelinePage() {
  const [items, setItems] = useState<BookingSummaryDto[] | null>(null);

  useEffect(() => {
    cabinetApi.listBookings().then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  const completed = items.filter((b) => b.status === 'completed');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Карта поездок</h1>
        <p className="text-ink-500 mt-1">История ваших путешествий и места, где вы уже побывали.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatTile big label="Поездок" value={String(completed.length)} />
        <StatTile big label="Стран" value="—" />
        <StatTile big label="Городов" value="—" />
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 text-white p-8 min-h-[280px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(198,40,40,0.5), transparent 40%), radial-gradient(circle at 70% 30%, rgba(245,158,11,0.4), transparent 40%)' }}
        />
        <div className="relative max-w-md">
          <MapIcon className="w-10 h-10 text-amber-500" />
          <h2 className="font-display font-extrabold text-2xl mt-4">Интерактивная карта мира — скоро</h2>
          <p className="text-white/70 mt-2">
            Здесь появится карта, где каждая ваша поездка станет точкой. Чем больше путешествий — тем красивее история.
          </p>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Plane className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Завершённых поездок пока нет — начните своё первое путешествие с Freestyle.</p>
        </div>
      ) : (
        <section>
          <h2 className="font-display font-bold text-xl text-ink-900 mb-3">Хронология</h2>
          <ul className="space-y-2">
            {completed.map((b) => (
              <li key={b.id} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-3">
                <Plane className="w-5 h-5 text-brand-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-ink-900">{b.title}</div>
                  <div className="text-[12.5px] text-ink-500">{new Date(b.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatTile({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className={`font-display font-extrabold text-ink-900 tabular-nums ${big ? 'text-3xl' : 'text-xl'}`}>{value}</div>
    </div>
  );
}
