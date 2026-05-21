import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import { useAuth } from '@/stores/auth';
import type { AuthLocale, AuthCurrency } from '@freestyle/shared';

const LOCALES: { code: AuthLocale; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const CURRENCIES: { code: AuthCurrency; label: string }[] = [
  { code: 'rub', label: 'RUB · Российский рубль' },
  { code: 'usd', label: 'USD · US Dollar' },
  { code: 'eur', label: 'EUR · Euro' },
  { code: 'cny', label: 'CNY · Юань' },
  { code: 'aed', label: 'AED · Дирхам ОАЭ' },
];

export function SettingsPage() {
  const { user, setUser } = useAuth();
  const [locale, setLocale] = useState<AuthLocale>(user?.locale ?? 'ru');
  const [currency, setCurrency] = useState<AuthCurrency>(user?.currency ?? 'rub');
  const [marketingOptIn, setMarketingOptIn] = useState(user?.marketingOptIn ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      const u = await cabinetApi.updateSettings({ locale, currency, marketingOptIn });
      setUser(u);
      setSaved(true);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Настройки</h1>

      <form onSubmit={save} className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8 space-y-5 max-w-lg">
        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Язык интерфейса</div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as AuthLocale)}
            className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl text-[15px] font-medium text-ink-900 outline-none focus:border-brand-500"
          >
            {LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>

        <label className="block">
          <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Валюта отображения цен</div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as AuthCurrency)}
            className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl text-[15px] font-medium text-ink-900 outline-none focus:border-brand-500"
          >
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span className="text-sm text-ink-700 leading-snug">
            <strong className="text-ink-900">Email-рассылки и горящие предложения</strong><br />
            Подборки от Феликса, sales-up to 70%, новости лоукостеров. Отписаться можно в любой момент.
          </span>
        </label>

        {saved && (
          <div className="text-sm rounded-xl px-4 py-3 bg-mint-500/10 border border-mint-500/30 text-mint-700">
            Настройки сохранены
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
