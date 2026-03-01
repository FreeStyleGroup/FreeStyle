const currencyMap: Record<string, { locale: string; currency: string }> = {
  rub: { locale: 'ru-RU', currency: 'RUB' },
  usd: { locale: 'en-US', currency: 'USD' },
  eur: { locale: 'de-DE', currency: 'EUR' },
  gbp: { locale: 'en-GB', currency: 'GBP' },
};

export function formatPrice(amount: number, currency = 'rub'): string {
  const config = currencyMap[currency.toLowerCase()] || currencyMap.rub;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
