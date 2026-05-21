import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { isAxiosError } from 'axios';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <AlertCircle className="w-14 h-14 mx-auto text-brand-600" />
        <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Нет токена в ссылке</h1>
        <Link
          to="/forgot-password"
          className="inline-block mt-8 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-500 to-brand-700"
        >
          Запросить ссылку снова
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const msg = isAxiosError(err)
        ? (err.response?.data as { error?: string })?.error
        : null;
      setError(msg ?? 'Не удалось сменить пароль. Возможно, ссылка истекла.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-mint-500" />
        <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Пароль обновлён!</h1>
        <p className="text-ink-500 mt-2">Перенаправляем на главную…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white border border-ink-100 rounded-3xl p-8 md:p-10 shadow-sm">
        <h1 className="font-display font-extrabold text-2xl text-ink-900 tracking-tight">
          Новый пароль
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          Минимум 8 символов, должен содержать буквы и цифры.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <PassField label="Новый пароль" value={password} onChange={setPassword} show={showPass} onToggle={() => setShowPass((v) => !v)} />
          <PassField label="Повторите пароль" value={confirm} onChange={setConfirm} show={showPass} onToggle={() => setShowPass((v) => !v)} />
          {error && (
            <div className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-brand-500 to-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Обновить пароль <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

interface PassFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}

function PassField({ label, value, onChange, show, onToggle }: PassFieldProps) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">{label} *</div>
      <div className="relative flex items-center bg-white border border-ink-200 rounded-xl focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(198,40,40,0.12)]">
        <Lock className="absolute left-4 w-4 h-4 text-ink-400 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full pl-11 pr-12 py-3.5 bg-transparent text-[15px] font-medium text-ink-900 outline-none rounded-xl"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 p-1.5 rounded-md text-ink-400 hover:text-ink-700 transition-colors cursor-pointer"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}
