import { useEffect, useState } from 'react';
import { Gift, Copy, Check, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { ReferralStatsDto } from '@freestyle/shared';

export function ReferralPage() {
  const [stats, setStats] = useState<ReferralStatsDto | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    cabinetApi.referral().then(setStats).catch(() => setStats(null));
  }, []);

  const copy = async () => {
    if (!stats) return;
    await navigator.clipboard.writeText(stats.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!stats) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Приведи друга</h1>
        <p className="text-ink-500 mt-1">
          Друг получит <strong>500 миль</strong> на первую поездку, вы — <strong>500 миль</strong> после её оплаты.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-3xl p-8 hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative">
          <Gift className="w-10 h-10 text-amber-400" />
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-white/70 mt-4">Ваш код</div>
          <div className="font-display font-extrabold text-5xl mt-1 tabular-nums">{stats.code}</div>

          <div className="mt-6 flex items-stretch gap-2 max-w-xl">
            <div className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur text-white/90 text-sm font-mono truncate">
              {stats.shareUrl}
            </div>
            <button
              type="button"
              onClick={() => void copy()}
              className="px-5 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              {copied ? <><Check className="w-4 h-4" /> Скопировано</> : <><Copy className="w-4 h-4" /> Копировать</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Регистраций по коду"  value={String(stats.signupsCount)} />
        <StatCard label="Брони от друзей"      value={String(stats.bookingsCount)} />
        <StatCard label="Миль начислено"       value={stats.totalMilesEarned.toLocaleString('ru-RU')} />
      </div>

      <section>
        <h2 className="font-display font-bold text-xl text-ink-900 mb-3">Последние приглашения</h2>
        {stats.recentRedemptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-10 text-center">
            <p className="text-ink-500">Пока никто не зарегистрировался по вашему коду. Поделитесь ссылкой выше.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {stats.recentRedemptions.map((r, i) => (
              <li key={i} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink-900">{r.invitedName}</div>
                  <div className="text-[12.5px] text-ink-500">{new Date(r.invitedAt).toLocaleDateString('ru-RU')}</div>
                </div>
                <div className="text-right">
                  {r.awardedAt ? (
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-mint-500/15 text-mint-700 text-[11px] uppercase font-bold tracking-wider">
                      +{r.milesAwarded.toLocaleString('ru-RU')} миль
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase font-bold tracking-wider text-ink-400">ожидает первой брони</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className="font-display font-extrabold text-3xl text-ink-900 tabular-nums mt-1">{value}</div>
    </div>
  );
}
