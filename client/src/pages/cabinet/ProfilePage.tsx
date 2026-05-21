import { useEffect, useState } from 'react';
import { User2, Phone, Image as ImageIcon, Lock, Loader2, MonitorSmartphone, LogOut } from 'lucide-react';
import { cabinetApi } from '@/api/cabinet.api';
import { useAuth } from '@/stores/auth';
import type { SessionDto } from '@freestyle/shared';
import { isAxiosError } from 'axios';

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: { message: string }[] } | undefined;
    if (data?.details?.[0]?.message) return data.details[0].message;
    if (data?.error) return data.error;
  }
  return fallback;
}

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [sessions, setSessions] = useState<SessionDto[] | null>(null);
  useEffect(() => { cabinetApi.listSessions().then(setSessions).catch(() => setSessions([])); }, []);

  if (!user) return null;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null); setSavingProfile(true);
    try {
      const u = await cabinetApi.updateProfile({ name, phone: phone || null, avatarUrl: avatarUrl || null });
      setUser(u);
      setProfileMsg({ type: 'ok', text: 'Профиль обновлён' });
    } catch (err) {
      setProfileMsg({ type: 'err', text: extractError(err, 'Не удалось сохранить') });
    } finally { setSavingProfile(false); }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'err', text: 'Пароли не совпадают' });
      return;
    }
    setSavingPwd(true);
    try {
      await cabinetApi.changePassword({ currentPassword, newPassword });
      setPwdMsg({ type: 'ok', text: 'Пароль изменён. Все остальные сессии разлогинены.' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      const upd = await cabinetApi.listSessions();
      setSessions(upd);
    } catch (err) {
      setPwdMsg({ type: 'err', text: extractError(err, 'Не удалось сменить пароль') });
    } finally { setSavingPwd(false); }
  };

  const revokeSession = async (id: string) => {
    await cabinetApi.revokeSession(id);
    setSessions((s) => s?.filter((x) => x.id !== id) ?? null);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl text-ink-900 tracking-tight">Профиль и безопасность</h1>

      {/* Профиль */}
      <section className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-xl text-ink-900 mb-4">Личные данные</h2>
        <form onSubmit={saveProfile} className="space-y-4 max-w-lg">
          <Field Icon={User2} label="Имя" value={name} onChange={setName} required />
          <Field Icon={Phone} label="Телефон" value={phone} onChange={setPhone} placeholder="+7 999 123-45-67" />
          <Field Icon={ImageIcon} label="URL аватара" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..." />
          {profileMsg && <Msg msg={profileMsg} />}
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-ink-100 text-sm text-ink-500">
          Email: <b className="text-ink-900">{user.email}</b>{' '}
          {user.emailVerifiedAt
            ? <span className="text-mint-700 font-bold">· подтверждён</span>
            : <span className="text-amber-700 font-bold">· не подтверждён</span>}
        </div>
      </section>

      {/* Пароль */}
      <section className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-xl text-ink-900 mb-4">Смена пароля</h2>
        <form onSubmit={changePassword} className="space-y-4 max-w-lg">
          <Field Icon={Lock} type="password" label="Текущий пароль" value={currentPassword} onChange={setCurrentPassword} required />
          <Field Icon={Lock} type="password" label="Новый пароль" value={newPassword} onChange={setNewPassword} required />
          <Field Icon={Lock} type="password" label="Повторите новый" value={confirmPassword} onChange={setConfirmPassword} required />
          {pwdMsg && <Msg msg={pwdMsg} />}
          <button
            type="submit"
            disabled={savingPwd}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Изменить пароль'}
          </button>
        </form>
      </section>

      {/* Активные сессии */}
      <section className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8">
        <h2 className="font-display font-bold text-xl text-ink-900 mb-4">Активные сессии</h2>
        {!sessions ? (
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        ) : sessions.length === 0 ? (
          <p className="text-ink-500">Активных сессий не найдено.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2">
                <MonitorSmartphone className="w-5 h-5 text-ink-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-900 text-sm truncate">{s.userAgent ?? '—'}</div>
                  <div className="text-[12px] text-ink-500">
                    {s.ip ?? '—'} · с {new Date(s.createdAt).toLocaleString('ru-RU')}
                    {s.isCurrent && <span className="ml-2 text-mint-700 font-bold">· текущая</span>}
                  </div>
                </div>
                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={() => void revokeSession(s.id)}
                    className="p-2 rounded-lg text-ink-400 hover:text-coral-600 hover:bg-coral-50 transition-colors cursor-pointer"
                    aria-label="Завершить сессию"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  Icon, type = 'text', label, value, onChange, placeholder, required,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  type?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">
        {label}{required && <span className="text-brand-500 ml-0.5">*</span>}
      </div>
      <div className="relative flex items-center bg-white border border-ink-200 rounded-xl focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(198,40,40,0.12)]">
        <Icon className="absolute left-4 w-4 h-4 text-ink-400 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-4 py-3 bg-transparent text-[15px] font-medium text-ink-900 placeholder:text-ink-400 outline-none rounded-xl"
        />
      </div>
    </label>
  );
}

function Msg({ msg }: { msg: { type: 'ok' | 'err'; text: string } }) {
  return (
    <div className={`text-sm rounded-xl px-4 py-3 ${
      msg.type === 'ok'
        ? 'bg-mint-500/10 border border-mint-500/30 text-mint-700'
        : 'bg-brand-50 border border-brand-200 text-brand-700'
    }`}>
      {msg.text}
    </div>
  );
}
