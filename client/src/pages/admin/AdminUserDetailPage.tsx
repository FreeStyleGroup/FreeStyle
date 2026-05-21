import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import type { UserDto, UserRole, UserStatus } from '@freestyle/shared';

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDto | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [status, setStatus] = useState<UserStatus>('active');
  const [name, setName] = useState('');
  const [milesDelta, setMilesDelta] = useState('');
  const [milesReason, setMilesReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    adminApi.getUser(id).then((u) => {
      setUser(u); setRole(u.role); setStatus(u.status); setName(u.name);
    }).catch(() => setUser(null));
  }, [id]);

  if (!id) return null;
  if (!user) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setSaving(true);
    try {
      const amount = milesDelta ? Number(milesDelta) : 0;
      const updated = await adminApi.updateUser(id, {
        role, status, name,
        ...(amount && milesReason ? { milesAdjustment: { amount, description: milesReason } } : {}),
      });
      setUser(updated);
      setMilesDelta(''); setMilesReason('');
      setMsg({ type: 'ok', text: 'Изменения сохранены' });
    } catch {
      setMsg({ type: 'err', text: 'Не удалось сохранить' });
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900">
        <ArrowLeft className="w-4 h-4" /> К списку
      </Link>

      <header>
        <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">{user.name}</h1>
        <div className="text-ink-500 mt-1">{user.email}</div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="ID" value={user.id.slice(0, 8)} />
        <Stat label="Tier" value={user.tier} />
        <Stat label="Мили" value={user.milesBalance.toLocaleString('ru-RU')} />
        <Stat label="Кэшбэк" value={Number(user.cashbackBalance).toLocaleString('ru-RU')} />
      </div>

      <form onSubmit={save} className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8 space-y-4 max-w-2xl">
        <h2 className="font-display font-bold text-xl text-ink-900">Управление учётной записью</h2>

        <Row label="Имя"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500" /></Row>
        <Row label="Роль">
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none">
            <option value="user">user</option><option value="editor">editor</option><option value="admin">admin</option>
          </select>
        </Row>
        <Row label="Статус">
          <select value={status} onChange={(e) => setStatus(e.target.value as UserStatus)} className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none">
            <option value="active">active</option><option value="banned">banned (отзовёт все сессии)</option><option value="pending">pending</option>
          </select>
        </Row>

        <fieldset className="border border-ink-100 rounded-xl p-4 space-y-3">
          <legend className="px-2 text-[11px] uppercase tracking-wider font-bold text-ink-500">Начисление миль (опционально)</legend>
          <Row label="Сумма (минус возможен)"><input type="number" value={milesDelta} onChange={(e) => setMilesDelta(e.target.value)} placeholder="500" className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500" /></Row>
          <Row label="Причина"><input value={milesReason} onChange={(e) => setMilesReason(e.target.value)} placeholder="Компенсация за задержку" className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500" /></Row>
        </fieldset>

        {msg && (
          <div className={`text-sm rounded-xl px-4 py-3 ${
            msg.type === 'ok' ? 'bg-mint-500/10 border border-mint-500/30 text-mint-700' : 'bg-brand-50 border border-brand-200 text-brand-700'
          }`}>{msg.text}</div>
        )}

        <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      <div className="font-display font-bold text-lg text-ink-900 mt-0.5 capitalize tabular-nums truncate">{value}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">{label}</div>
      {children}
    </label>
  );
}
