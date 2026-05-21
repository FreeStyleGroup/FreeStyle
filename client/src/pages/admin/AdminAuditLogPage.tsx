import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminAuditEntry } from '@freestyle/shared';

export function AdminAuditLogPage() {
  const [items, setItems] = useState<AdminAuditEntry[] | null>(null);
  useEffect(() => { adminApi.listAudit().then(setItems).catch(() => setItems([])); }, []);

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Журнал действий</h1>

      {!items ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center text-ink-500">
          Действий пока не зарегистрировано.
        </div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
              <tr>
                <th className="px-4 py-3">Время</th><th className="px-4 py-3">Кто</th>
                <th className="px-4 py-3">Действие</th><th className="px-4 py-3">Объект</th>
                <th className="px-4 py-3">Детали</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 text-ink-500 whitespace-nowrap">{new Date(e.createdAt).toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3 font-bold text-ink-900">{e.actorName ?? '—'}</td>
                  <td className="px-4 py-3"><code className="text-[12px] bg-surface-2 px-2 py-0.5 rounded">{e.action}</code></td>
                  <td className="px-4 py-3 text-ink-700">
                    {e.entityType ?? '—'}{e.entityId && <span className="text-ink-400"> · {e.entityId.slice(0, 8)}</span>}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-500 max-w-xs truncate">
                    {Object.keys(e.meta).length ? JSON.stringify(e.meta) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
