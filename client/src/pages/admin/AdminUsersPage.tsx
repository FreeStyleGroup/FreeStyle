import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { AdminUsersListResponse, UserRole, UserStatus } from '@freestyle/shared';

export function AdminUsersPage() {
  const [data, setData] = useState<AdminUsersListResponse | null>(null);
  const [q, setQ] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [status, setStatus] = useState<UserStatus | ''>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setData(null);
    adminApi
      .listUsers({ q: q || undefined, role: role || undefined, status: status || undefined, page })
      .then(setData)
      .catch(() => setData(null));
  }, [q, role, status, page]);

  return (
    <div className="space-y-5">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Пользователи</h1>

      <div className="bg-white border border-ink-100 rounded-2xl p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
            <input
              type="search"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              placeholder="Поиск по имени или email"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>
        <select
          value={role}
          onChange={(e) => { setPage(1); setRole(e.target.value as UserRole | ''); }}
          className="px-3 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none"
        >
          <option value="">Все роли</option>
          <option value="user">user</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value as UserStatus | ''); }}
          className="px-3 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none"
        >
          <option value="">Все статусы</option>
          <option value="active">active</option>
          <option value="banned">banned</option>
          <option value="pending">pending</option>
        </select>
      </div>

      {!data ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-2">
              <tr className="text-left text-[11px] uppercase tracking-wider font-bold text-ink-500">
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Роль</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Tier · Мили</th>
                <th className="px-4 py-3">Регистрация</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-500">Ничего не найдено</td></tr>
              ) : data.items.map((u) => (
                <tr key={u.id} className="border-t border-ink-100 hover:bg-surface-1">
                  <td className="px-4 py-3 font-bold text-ink-900">{u.name}</td>
                  <td className="px-4 py-3 text-ink-700">{u.email}</td>
                  <td className="px-4 py-3"><RoleTag role={u.role} /></td>
                  <td className="px-4 py-3"><StatusTag status={u.status} /></td>
                  <td className="px-4 py-3 tabular-nums">
                    <span className="capitalize">{u.tier}</span> · {u.milesBalance.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-ink-500">{new Date(u.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/users/${u.id}`} className="text-brand-600 font-bold hover:text-brand-700">Открыть →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={data.meta} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

function RoleTag({ role }: { role: UserRole }) {
  const tone = role === 'admin' ? 'bg-brand-50 text-brand-700'
    : role === 'editor' ? 'bg-amber-50 text-amber-700'
    : 'bg-ink-100 text-ink-700';
  return <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${tone}`}>{role}</span>;
}

function StatusTag({ status }: { status: UserStatus }) {
  const tone = status === 'active' ? 'bg-mint-500/15 text-mint-700'
    : status === 'banned' ? 'bg-coral-100 text-coral-700'
    : 'bg-amber-50 text-amber-700';
  return <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${tone}`}>{status}</span>;
}

function Pagination({ meta, onChange }: { meta: { total: number; page: number; pageSize: number }; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  if (pages <= 1) return null;
  return (
    <div className="px-4 py-3 border-t border-ink-100 flex items-center justify-between text-sm">
      <div className="text-ink-500">Всего: <b className="text-ink-900">{meta.total}</b></div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => onChange(meta.page - 1)}
          className="px-3 py-1.5 rounded-lg text-ink-700 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Назад
        </button>
        <span className="px-3 text-ink-500">{meta.page} из {pages}</span>
        <button
          type="button"
          disabled={meta.page >= pages}
          onClick={() => onChange(meta.page + 1)}
          className="px-3 py-1.5 rounded-lg text-ink-700 hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
}
