import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/api/auth.api';

type Status = 'pending' | 'ok' | 'fail';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    let cancelled = false;
    if (!token) { setStatus('fail'); return; }
    (async () => {
      try {
        await authApi.verifyEmail({ token });
        if (!cancelled) setStatus('ok');
      } catch {
        if (!cancelled) setStatus('fail');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center">
      {status === 'pending' && (
        <>
          <Loader2 className="w-12 h-12 mx-auto text-brand-600 animate-spin" />
          <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Подтверждаем email…</h1>
        </>
      )}
      {status === 'ok' && (
        <>
          <CheckCircle2 className="w-14 h-14 mx-auto text-mint-500" />
          <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Email подтверждён!</h1>
          <p className="text-ink-500 mt-2">Спасибо. Теперь у вас полный доступ к FreeStyle.</p>
          <Link
            to="/"
            className="inline-block mt-8 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-500 to-brand-700 hover:-translate-y-0.5 transition-all"
          >
            На главную
          </Link>
        </>
      )}
      {status === 'fail' && (
        <>
          <AlertCircle className="w-14 h-14 mx-auto text-brand-600" />
          <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Ссылка недействительна</h1>
          <p className="text-ink-500 mt-2">
            Возможно, она уже использована или истёк срок действия (24 часа).
            Войдите в аккаунт и запросите письмо повторно из настроек.
          </p>
          <Link
            to="/"
            className="inline-block mt-8 px-6 py-3 rounded-xl font-bold text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-surface-2 transition-all"
          >
            На главную
          </Link>
        </>
      )}
    </div>
  );
}
