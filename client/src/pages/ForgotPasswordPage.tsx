import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/api/auth.api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white border border-ink-100 rounded-3xl p-8 md:p-10 shadow-sm">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-14 h-14 mx-auto text-mint-500" />
            <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Письмо отправлено</h1>
            <p className="text-ink-500 mt-2">
              Если такой email зарегистрирован — на него придёт ссылка для сброса пароля.
              Ссылка действует 1 час.
            </p>
            <Link
              to="/"
              className="inline-block mt-8 px-6 py-3 rounded-xl font-bold text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-surface-2 transition-all"
            >
              На главную
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-2xl text-ink-900 tracking-tight">
              Восстановление пароля
            </h1>
            <p className="text-sm text-ink-500 mt-2">
              Укажите email от вашего аккаунта — пришлём ссылку для создания нового пароля.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <label className="block">
                <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Email *</div>
                <div className="relative flex items-center bg-white border border-ink-200 rounded-xl focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(198,40,40,0.12)]">
                  <Mail className="absolute left-4 w-4 h-4 text-ink-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[15px] font-medium text-ink-900 placeholder:text-ink-400 outline-none rounded-xl"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-brand-500 to-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <>Отправить ссылку <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
