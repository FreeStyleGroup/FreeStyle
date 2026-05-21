import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Heart, FileText, Wallet, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import { useAuth } from '@/stores/auth';
import type { CabinetDashboardDto } from '@freestyle/shared';

export function CabinetDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<CabinetDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cabinetApi.dashboard().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !data || !user) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">
          Здравствуйте, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-ink-500 mt-1">Ваш персональный travel-центр.</p>
      </header>

      {/* Wallet card */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white hero-gradient">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[.16em] font-bold text-white/70">Travel Wallet</div>
            <div className="font-display font-extrabold text-4xl mt-2 tabular-nums">
              {data.wallet.milesBalance.toLocaleString('ru-RU')}
              <span className="text-base font-medium text-white/70 ml-2">миль</span>
            </div>
            <div className="text-sm text-white/80 mt-1">
              + {Number(data.wallet.cashbackBalance).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}{' '}
              <span className="text-white/60">{user.currency.toUpperCase()} кэшбэка</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[.16em] font-bold text-white/70">Статус</div>
            <div className="font-display font-extrabold text-2xl mt-2 capitalize">{data.wallet.tier}</div>
            {data.wallet.nextTier && data.wallet.milesToNextTier !== null && (
              <div className="text-sm text-white/80 mt-1">
                до <span className="capitalize">{data.wallet.nextTier}</span>: ещё {data.wallet.milesToNextTier.toLocaleString('ru-RU')} миль
              </div>
            )}
          </div>
          <div className="md:text-right md:flex md:flex-col md:items-end">
            <Link
              to="/cabinet/wallet"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:-translate-y-0.5 transition-all"
            >
              История начислений <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Plane}
          label="Поездок впереди"
          value={String(data.upcomingTrips.length)}
          href="/cabinet/trips"
        />
        <StatCard
          icon={Heart}
          label="В избранном"
          value={String(data.favoritesCount)}
          href="/cabinet/favorites"
        />
        <StatCard
          icon={FileText}
          label="Документов"
          value={String(data.documentsCount)}
          href="/cabinet/documents"
        />
        <StatCard
          icon={Wallet}
          label="Накоплено миль"
          value={data.wallet.milesBalance.toLocaleString('ru-RU')}
          href="/cabinet/wallet"
        />
      </div>

      {/* Expiring docs warning */}
      {data.expiringDocuments.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-bold text-ink-900">Документы скоро истекут</div>
            <ul className="mt-2 space-y-1 text-sm text-ink-700">
              {data.expiringDocuments.map((d) => (
                <li key={d.id}>
                  <strong>{d.name}</strong> — до {new Date(d.expiresAt).toLocaleDateString('ru-RU')}
                </li>
              ))}
            </ul>
            <Link to="/cabinet/documents" className="inline-block mt-3 text-sm font-bold text-brand-600 hover:text-brand-700">
              Обновить документы →
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming trips */}
      <section>
        <h2 className="font-display font-extrabold text-xl text-ink-900 mb-3">Ближайшие поездки</h2>
        {data.upcomingTrips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-8 text-center">
            <Plane className="w-10 h-10 mx-auto text-ink-300" />
            <p className="mt-3 text-ink-500">Пока нет активных бронирований.</p>
            <Link to="/" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm">
              Найти поездку
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {data.upcomingTrips.map((t) => (
              <div key={t.id} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-ink-900">{t.title}</div>
                  <div className="text-[12.5px] text-ink-500">
                    {t.publicId} · {new Date(t.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-lg text-ink-900 tabular-nums">
                    {Number(t.amount).toLocaleString('ru-RU')} {t.currency.toUpperCase()}
                  </div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-mint-700">{statusLabel(t.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function statusLabel(s: string): string {
  switch (s) {
    case 'paid':       return 'Оплачено';
    case 'confirmed':  return 'Подтверждено';
    case 'pending':    return 'В обработке';
    case 'cancelled':  return 'Отменено';
    case 'completed':  return 'Завершено';
    case 'refunded':   return 'Возврат';
    default: return s;
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="block bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
          <div className="font-display font-extrabold text-2xl text-ink-900 tabular-nums">{value}</div>
        </div>
      </div>
    </Link>
  );
}
