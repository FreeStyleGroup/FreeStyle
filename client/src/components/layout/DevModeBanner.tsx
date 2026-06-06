import { AlertCircle } from 'lucide-react';

/**
 * Полоса «сайт в режиме разработки / тестовые данные».
 * Показывается на ВСЕХ страницах, пока проект тестируется.
 *
 * Управляется build-time переменной VITE_DEV_NOTICE:
 *   - не задана / любое значение кроме 'false' → баннер ВИДЕН (режим разработки)
 *   - VITE_DEV_NOTICE=false → баннер скрыт (боевой запуск)
 *
 * Скрыть на проде: задать VITE_DEV_NOTICE=false в .env и пересобрать client.
 */
export function DevModeBanner() {
  const hidden = (import.meta.env.VITE_DEV_NOTICE ?? '').toString().trim().toLowerCase() === 'false';
  if (hidden) return null;

  return (
    <div
      role="status"
      className="bg-amber-500 text-ink-900 text-[12.5px] font-bold py-2 px-4 text-center"
    >
      <span className="inline-flex items-center gap-2 leading-tight">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        Сайт в режиме разработки и наполнен тестовыми данными — идёт тестирование.
      </span>
    </div>
  );
}
