import { AlertCircle } from 'lucide-react';
import { isPreview, previewRole } from '@/lib/preview';

/**
 * Жёлтая полоса сверху — отрисовывается только в preview-режиме
 * (VITE_PREVIEW_AUTH=admin|editor|user). Видна всегда, чтобы случайно
 * не путать с проданной версией.
 */
export function PreviewBanner() {
  if (!isPreview()) return null;
  const role = previewRole();
  return (
    <div className="bg-amber-500 text-ink-900 text-[12.5px] font-bold py-2 px-4 text-center sticky top-0 z-[60]">
      <span className="inline-flex items-center gap-2 leading-tight">
        <AlertCircle className="w-3.5 h-3.5" />
        Preview-режим · авторизация подменена ({role}) · API-данные mock
      </span>
    </div>
  );
}
