/**
 * Бегущая строка «сайт в режиме разработки / тестовые данные» (China-стиль).
 * Брендовый тинт, текст бесконечно бежит влево. Стоит в верху контента (под шапкой),
 * на всех страницах.
 *
 * Управляется build-time переменной VITE_DEV_NOTICE:
 *   - не задана / любое значение кроме 'false' → строка ВИДНА (режим разработки)
 *   - VITE_DEV_NOTICE=false → скрыта (боевой запуск)
 *
 * Скрыть на проде: VITE_DEV_NOTICE=false в .env → пересобрать client.
 */
const NOTICE = 'Сайт находится в режиме разработки и наполнен тестовыми данными!';

export function DevModeBanner() {
  const hidden =
    (import.meta.env.VITE_DEV_NOTICE ?? '').toString().trim().toLowerCase() === 'false';
  if (hidden) return null;

  return (
    <div
      role="status"
      aria-label="Режим разработки"
      className="w-full overflow-hidden bg-brand-600/[0.06] border-y border-brand-600/15 py-2.5"
    >
      <div className="fs-dev-marquee-track flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 pr-14 text-[13px] font-semibold tracking-tight text-brand-700"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            {NOTICE}
          </span>
        ))}
      </div>
    </div>
  );
}
