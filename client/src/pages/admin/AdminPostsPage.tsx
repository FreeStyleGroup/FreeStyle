import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Newspaper } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminPostsListResponse } from '@freestyle/shared';

type Status = 'draft' | 'scheduled' | 'published' | 'archived';

export function AdminPostsPage() {
  const [data, setData] = useState<AdminPostsListResponse | null>(null);
  const [status, setStatus] = useState<Status | ''>('');

  useEffect(() => {
    setData(null);
    adminApi.listPosts({ status: status || undefined }).then(setData).catch(() => setData(null));
  }, [status]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Статьи</h1>
        <Link to="/admin/posts/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800">
          <Plus className="w-4 h-4" /> Новая
        </Link>
      </div>

      <div className="inline-flex bg-surface-2 rounded-xl p-1.5">
        {(['', 'draft', 'scheduled', 'published', 'archived'] as const).map((s) => (
          <button key={s || 'all'} type="button" onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${status === s ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>
            {s === '' ? 'Все' : s}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Newspaper className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">Статей пока нет. Создайте первую.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
              <tr>
                <th className="px-4 py-3">Заголовок</th><th className="px-4 py-3">Slug · locale</th>
                <th className="px-4 py-3">Статус</th><th className="px-4 py-3">Обновлено</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 font-bold text-ink-900">{p.title}</td>
                  <td className="px-4 py-3 text-ink-700"><code className="text-[12px]">{p.slug}</code> · {p.locale}</td>
                  <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-ink-100 text-ink-700">{p.status}</span></td>
                  <td className="px-4 py-3 text-ink-500">{new Date(p.updatedAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/posts/${p.id}`} className="text-brand-600 font-bold hover:text-brand-700">Редактировать →</Link>
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
