import { useEffect, useRef } from 'react';

/**
 * TpWidget — универсальная обёртка над Travelpayouts JS-виджетами.
 * Принимает src скрипта (с уже впаянным marker'ом), вставляет его в контейнер.
 *
 * Используется на страницах Tours / Insurance / CarRental / Hotels.
 * Marker 304805 уже в src — TP-кабинет генерит готовую строку с marker'ом.
 */
interface Props {
  src: string;
  height?: number;
  fallback?: React.ReactNode;
}

export function TpWidget({ src, height = 480, fallback }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.charset = 'utf-8';
    containerRef.current.appendChild(script);
  }, [src]);

  return (
    <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
      <div ref={containerRef} style={{ minHeight: height }}>
        {fallback ?? (
          <div className="p-8 text-center text-ink-500">
            Загружаем виджет…
          </div>
        )}
      </div>
    </div>
  );
}

/** Конструктор партнёрской ссылки для Aviasales / Hotellook / etc. */
export function tpRefLink(opts: {
  base: string;
  marker?: string;
  subId?: string;
  params?: Record<string, string | number | undefined>;
}): string {
  const marker = opts.marker ?? '304805';
  const fullMarker = opts.subId ? `${marker}.${opts.subId}` : marker;
  const url = new URL(opts.base);
  url.searchParams.set('marker', fullMarker);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}
