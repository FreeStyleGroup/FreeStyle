import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminOrdersListResponse } from '@freestyle/shared';

type Status = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed' | 'refunded';
type Kind = 'flight' | 'hotel' | 'tour' | 'visa' | 'transfer' | 'insurance';

export function AdminOrdersPage() {
  const [data, setData] = useState<AdminOrdersListResponse | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [type, setType] = useState<Kind | ''>('');
  const [page, setPage] = useState(1);

  const load = () => {
    setData(null);
    adminApi
      .listOrders({ q: q || undefined, status: status || undefined, type: type || undefined, page })
      .then(setData)
      .catch(() => setData(null));
  };

  useEffect(load, [q, status, type, page]);

  const updateStatus = async (id: string, s: Status) => {
    await adminApi.updateOrder(id, { status: s });
    load();
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Заказы</h1>

      <div className="bg-white border border-ink-100 rounded-2xl p-4 flex flex-wrap gap-3">
        <input
          type="search" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }}
          placeholder="Поиск по № заказа"
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
        />
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as Status | ''); }} className="px-3 py-2.5 bg-white border border-ink-200 rounded-xl text-sm">
          <option value="">Все статусы</option>
          <option value="pending">pending</option><option value="confirmed">confirmed</option>
          <option value="paid">paid</option><option value="completed">completed</option>
          <option value="cancelled">cancelled</option><option value="refunded">refunded</option>
        </select>
        <select value={type} onChange={(e) => { setPage(1); setType(e.target.value as Kind | ''); }} className="px-3 py-2.5 bg-white border border-ink-200 rounded-xl text-sm">
          <option value="">Все типы</option>
          <option value="flight">flight</option><option value="hotel">hotel</option>
          <option value="tour">tour</option><option value="visa">visa</option>
          <option value="transfer">transfer</option><option value="insurance">insurance</option>
        </select>
      </div>

      {!data ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
              <tr>
                <th className="px-4 py-3">№</th><th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Заказ</th><th className="px-4 py-3">Клиент</th>
                <th className="px-4 py-3">Сумма</th><th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действие</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-500">Заказов нет</td></tr>
              ) : data.items.map((o) => (
                <tr key={o.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 font-mono text-[12px] text-ink-700">{o.publicId}</td>
                  <td className="px-4 py-3 capitalize">{o.type}</td>
                  <td className="px-4 py-3 font-bold text-ink-900">{o.title}</td>
                  <td className="px-4 py-3 text-ink-700">{o.userName}<br /><span className="text-[11px] text-ink-500">{o.userEmail}</span></td>
                  <td className="px-4 py-3 font-bold tabular-nums">{Number(o.amount).toLocaleString('ru-RU')} {o.currency.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-ink-100 text-ink-700">{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => void updateStatus(o.id, e.target.value as Status)}
                      className="px-2 py-1.5 border border-ink-200 rounded-lg text-[12px]"
                    >
                      <option value="pending">pending</option><option value="confirmed">confirmed</option>
                      <option value="paid">paid</option><option value="completed">completed</option>
                      <option value="cancelled">cancelled</option><option value="refunded">refunded</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Math.ceil(data.meta.total / data.meta.pageSize) > 1 && (
            <div className="px-4 py-3 border-t border-ink-100 flex items-center justify-between text-sm">
              <div className="text-ink-500">Всего: <b className="text-ink-900">{data.meta.total}</b></div>
              <div className="flex items-center gap-1">
                <button type="button" disabled={data.meta.page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-ink-700 hover:bg-surface-2 disabled:opacity-40">← Назад</button>
                <span className="px-3 text-ink-500">{data.meta.page} из {Math.ceil(data.meta.total / data.meta.pageSize)}</span>
                <button type="button" disabled={data.meta.page * data.meta.pageSize >= data.meta.total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-ink-700 hover:bg-surface-2 disabled:opacity-40">Вперёд →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
