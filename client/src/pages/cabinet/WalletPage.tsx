import { useEffect, useState } from 'react';
import { Sparkles, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import type { WalletSummaryDto, WalletTxnDto } from '@freestyle/shared';

export function WalletPage() {
  const [summary, setSummary] = useState<WalletSummaryDto | null>(null);
  const [txns, setTxns] = useState<WalletTxnDto[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'miles' | 'cashback'>('all');

  useEffect(() => {
    Promise.all([
      cabinetApi.walletSummary(),
      cabinetApi.walletTransactions(),
    ]).then(([s, t]) => {
      setSummary(s);
      setTxns(t);
    }).catch(() => {
      setSummary(null);
      setTxns([]);
    });
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      cabinetApi.walletTransactions().then(setTxns).catch(() => setTxns([]));
    } else {
      cabinetApi.walletTransactions(filter).then(setTxns).catch(() => setTxns([]));
    }
  }, [filter]);

  if (!summary || !txns) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Travel Wallet</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <BalanceCard
          label="Бонусные мили"
          value={summary.milesBalance.toLocaleString('ru-RU')}
          unit="миль"
          gradient="from-brand-500 to-brand-700"
        />
        <BalanceCard
          label="Кэшбэк"
          value={Number(summary.cashbackBalance).toLocaleString('ru-RU', { maximumFractionDigits: 2 })}
          unit="RUB"
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {summary.nextTier && summary.milesToNextTier !== null && summary.milesToNextTier > 0 && (
        <div className="rounded-2xl bg-white border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-ink-900 capitalize">
              <Sparkles className="inline w-4 h-4 text-amber-500 mr-1.5" />
              До статуса {summary.nextTier} ещё {summary.milesToNextTier.toLocaleString('ru-RU')} миль
            </div>
            <div className="text-sm text-ink-500">текущий: <span className="capitalize font-bold">{summary.tier}</span></div>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full"
              style={{
                width: `${Math.min(100, (summary.milesBalance / (summary.milesBalance + summary.milesToNextTier)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-xl text-ink-900">История</h2>
          <div className="inline-flex bg-surface-2 rounded-xl p-1">
            {(['all', 'miles', 'cashback'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors ${
                  filter === f ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500'
                }`}
              >
                {{ all: 'Все', miles: 'Мили', cashback: 'Кэшбэк' }[f]}
              </button>
            ))}
          </div>
        </div>
        {txns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 p-10 text-center">
            <p className="text-ink-500">Транзакций пока нет. Первая поездка — первые мили.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {txns.map((t) => {
              const positive = !t.amount.startsWith('-');
              return (
                <li key={t.id} className="bg-white border border-ink-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${positive ? 'bg-mint-500/15 text-mint-700' : 'bg-coral-100 text-coral-700'}`}>
                    {positive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-900 truncate">{t.description}</div>
                    <div className="text-[12.5px] text-ink-500">{new Date(t.createdAt).toLocaleString('ru-RU')}</div>
                  </div>
                  <div className={`font-display font-extrabold text-lg tabular-nums shrink-0 ${positive ? 'text-mint-700' : 'text-coral-700'}`}>
                    {positive ? '+' : ''}{Number(t.amount).toLocaleString('ru-RU')}{' '}
                    <span className="text-[12px] font-medium text-ink-500 uppercase">{t.kind === 'miles' ? 'миль' : (t.currency ?? '')}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function BalanceCard({ label, value, unit, gradient }: { label: string; value: string; unit: string; gradient: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${gradient}`}>
      <div className="text-[11px] uppercase tracking-[.16em] font-bold text-white/70">{label}</div>
      <div className="font-display font-extrabold text-4xl mt-2 tabular-nums">
        {value} <span className="text-base font-medium text-white/70">{unit}</span>
      </div>
    </div>
  );
}
