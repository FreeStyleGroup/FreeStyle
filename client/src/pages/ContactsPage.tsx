import { useState } from 'react';
import { Mail, Phone, MessageCircle, Send, MapPin, Clock, Loader2, CheckCircle2, User as UserIcon } from 'lucide-react';
import { contactApi } from '@/api/contact.api';
import { useAuth } from '@/stores/auth';
import { isAxiosError } from 'axios';

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: { message: string }[] } | undefined;
    if (data?.details?.[0]?.message) return data.details[0].message;
    if (data?.error) return data.error;
  }
  return fallback;
}

export function ContactsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await contactApi.submit({
        name, email,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
        sourcePage: window.location.pathname,
      });
      setSent(true);
      setSubject(''); setMessage('');
    } catch (err) {
      setError(extractError(err, 'Не удалось отправить. Попробуйте ещё раз.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
          Контакты
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink-900 leading-tight tracking-tight mb-4">
          Свяжитесь с нами
        </h1>
        <p className="text-ink-500 text-lg max-w-2xl mx-auto">
          Поможем спланировать поездку, ответим на любой вопрос о бронированиях, кэшбэке и AI-консьерже.
        </p>
      </header>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        {/* FORM */}
        <div className="bg-white border border-ink-100 rounded-3xl p-6 md:p-10 shadow-sm">
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-14 h-14 mx-auto text-mint-500" />
              <h2 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Сообщение отправлено!</h2>
              <p className="text-ink-500 mt-2 max-w-sm mx-auto">
                Спасибо. Мы ответим на ваш email в течение 24 часов.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="inline-block mt-8 px-6 py-3 rounded-xl font-bold text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-surface-2 transition-all"
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-display font-extrabold text-xl text-ink-900 mb-4">Напишите нам</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field Icon={UserIcon} label="Имя *" value={name} onChange={setName} placeholder="Иван Петров" required />
                <Field Icon={Mail} type="email" label="Email *" value={email} onChange={setEmail} placeholder="your@email.com" required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field Icon={Phone} type="tel" label="Телефон" value={phone} onChange={setPhone} placeholder="+7 999 123-45-67" />
                <Field Icon={MessageCircle} label="Тема" value={subject} onChange={setSubject} placeholder="О чём пишете?" />
              </div>

              <label className="block">
                <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">Сообщение *</div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  minLength={10}
                  placeholder="Расскажите подробнее…"
                  className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl text-[15px] text-ink-900 outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(198,40,40,0.12)] resize-y"
                />
              </label>

              {error && (
                <div className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-brand-500 to-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Отправить сообщение</>}
              </button>

              <p className="text-[11.5px] text-ink-400 leading-relaxed">
                Нажимая «Отправить», вы соглашаетесь с <a href="/terms" className="text-brand-600 hover:underline">условиями использования</a>{' '}
                и <a href="/privacy" className="text-brand-600 hover:underline">политикой конфиденциальности</a>.
              </p>
            </form>
          )}
        </div>

        {/* INFO */}
        <aside className="space-y-4">
          <InfoCard Icon={Mail} title="Email">
            <a href="mailto:hello@freestyle.ru" className="text-brand-600 font-bold hover:text-brand-700">hello@freestyle.ru</a>
            <div className="text-sm text-ink-500 mt-1">Ответим в течение 24 часов</div>
          </InfoCard>

          <InfoCard Icon={MessageCircle} title="Telegram">
            <a href="https://t.me/freestyle_ru" target="_blank" rel="noopener" className="text-brand-600 font-bold hover:text-brand-700">@freestyle_ru</a>
            <div className="text-sm text-ink-500 mt-1">Быстрый канал поддержки</div>
          </InfoCard>

          <InfoCard Icon={Sparkles} title="AI-консьерж">
            <div className="text-ink-900 font-bold">Феликс · 24/7</div>
            <div className="text-sm text-ink-500 mt-1">Кнопка чата справа внизу — спросите про любое направление</div>
          </InfoCard>

          <InfoCard Icon={MapPin} title="Офис">
            <div className="text-ink-900">Москва · Тбилиси · Дубай</div>
            <div className="text-sm text-ink-500 mt-1">Полностью удалённая команда</div>
          </InfoCard>

          <InfoCard Icon={Clock} title="Срочно?">
            <div className="text-sm text-ink-700">Если что-то по уже забронированной поездке — звоните или пишите в Telegram. Не дожидайтесь email.</div>
          </InfoCard>
        </aside>
      </div>

      {/* ─── Карта офиса в Дубае ─── */}
      <section className="mt-16 md:mt-20">
        <div className="text-center mb-8">
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">Главный офис</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
            Дубай · <em className="not-italic text-brand-600">DIFC</em>
          </h2>
          <p className="text-ink-500 mt-3 max-w-xl mx-auto">
            Центральный офис команды в финансовом районе Дубая. Партнёры, юристы, поддержка ключевых клиентов.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-ink-100 shadow-sm">
          <iframe
            title="FreeStyle · офис в Дубае"
            src="https://yandex.ru/map-widget/v1/?ll=55.2790%2C25.2138&z=14&pt=55.2790%2C25.2138%2Cpm2rdl"
            width="100%"
            height="460"
            allowFullScreen
            loading="lazy"
            style={{ display: 'block', border: 0 }}
          />
        </div>

        <p className="text-center text-[11.5px] text-ink-400 mt-3">
          DIFC · Dubai International Financial Centre · UTC+4
        </p>
      </section>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
    </svg>
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
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">{label}</div>
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

function InfoCard({ Icon, title, children }: { Icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500 mb-1">{title}</div>
          {children}
        </div>
      </div>
    </div>
  );
}
