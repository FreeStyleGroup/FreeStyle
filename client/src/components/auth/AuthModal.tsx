import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, Phone,
  Sparkles, ShieldCheck, Wallet, Gift, ArrowRight, Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/stores/auth';
import { isAxiosError } from 'axios';

/**
 * AuthModal — премиум двухколоночный модал входа/регистрации.
 * Уровень AAA travel-сервиса: боковая панель с benefits + soc-логины +
 * floating-поля с иконками + анимированный таб-индикатор.
 *
 * Подключён к /api/auth/{login,register} — после успеха обновляет
 * useAuth().user и закрывает модал.
 */

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: { message: string }[] } | undefined;
    if (data?.details?.[0]?.message) return data.details[0].message;
    if (data?.error) return data.error;
  }
  return fallback;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

type Tab = 'login' | 'register';

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" bare>
      <div className="grid md:grid-cols-[1.05fr_1.1fr] bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[640px]">
        {/* ───────────── ЛЕВАЯ ПАНЕЛЬ — БЕНЕФИТЫ ───────────── */}
        <SidePanel />

        {/* ───────────── ПРАВАЯ ПАНЕЛЬ — ФОРМА ───────────── */}
        <div className="bg-white p-8 md:p-12 flex flex-col">
          {/* Tabs */}
          <TabSwitcher active={activeTab} onChange={setActiveTab} />

          {/* Form */}
          <div className="mt-8 flex-1">
            {activeTab === 'login' ? <LoginForm onClose={onClose} /> : <RegisterForm onClose={onClose} />}
          </div>

          {/* Bottom: switch tab */}
          <div className="mt-6 pt-6 border-t border-ink-100 text-center text-sm text-ink-500">
            {activeTab === 'login' ? (
              <>
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-brand-600 font-bold hover:text-brand-700 transition-colors cursor-pointer"
                >
                  Зарегистрируйтесь
                </button>
              </>
            ) : (
              <>
                Уже зарегистрированы?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-brand-600 font-bold hover:text-brand-700 transition-colors cursor-pointer"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────
// SIDE PANEL — travel-визуал + benefits
// ─────────────────────────────────────────
function SidePanel() {
  return (
    <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-12 overflow-hidden text-white hero-gradient">
      {/* Bg image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80&auto=format&fit=crop)',
        }}
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Decorative big letter */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 font-display font-extrabold text-white/[.06] text-[260px] leading-none pointer-events-none select-none">
        FS
      </div>

      <div className="relative z-10">
        {/* Logo + eyebrow */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-lg border border-white/25 grid place-items-center font-display font-extrabold text-lg">
            FS
          </div>
          <div>
            <div className="font-display font-extrabold text-lg leading-tight">FreeStyle</div>
            <div className="text-[10px] uppercase tracking-[.18em] font-semibold text-white/65">
              Travel · Hotels · Tours
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 mt-8 rounded-full glass-pill text-white text-[10.5px] font-mono font-medium tracking-[.15em] uppercase">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-amber-500 animate-pulse-amber" />
            <span className="relative inline-flex w-full h-full rounded-full bg-amber-500" />
          </span>
          Закрытый клуб путешественников
        </div>

        <h2 className="font-display font-extrabold text-3xl lg:text-4xl leading-tight tracking-tight mt-5 mb-3">
          Один аккаунт — <em className="not-italic text-amber-500">весь мир</em>
        </h2>
        <p className="text-white/85 leading-relaxed text-[15px] max-w-md">
          Бронируйте авиабилеты, отели и туры в одном окне.
          Получайте бонусы, кэшбэк и эксклюзивные предложения.
        </p>
      </div>

      {/* Benefits list */}
      <div className="relative z-10 space-y-3 mt-10">
        <Benefit Icon={Wallet}      title="Кэшбэк до 5%"           text="на каждое бронирование" />
        <Benefit Icon={Gift}        title="Бонусные мили"          text="копятся автоматически" />
        <Benefit Icon={ShieldCheck} title="Защита платежей"        text="безопасные транзакции SSL" />
        <Benefit Icon={Sparkles}    title="Эксклюзивные предложения" text="недоступные публично" />
      </div>
    </div>
  );
}

function Benefit({ Icon, title, text }: { Icon: typeof Wallet; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 grid place-items-center text-amber-500">
        <Icon className="w-4 h-4" />
      </div>
      <div className="pt-0.5">
        <div className="font-display font-bold text-sm text-white">{title}</div>
        <div className="text-[12.5px] text-white/70 leading-tight">{text}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TAB SWITCHER — CSS-only slide indicator (без useRef/offsetWidth)
// ─────────────────────────────────────────
function TabSwitcher({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="relative inline-grid grid-cols-2 bg-surface-2 rounded-2xl p-1.5 w-fit">
      <div
        className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm pointer-events-none transition-all duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          left: active === 'login' ? '0.375rem' : '50%',
          width: 'calc(50% - 0.375rem)',
        }}
      />
      {(['login', 'register'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            'relative z-10 px-7 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors',
            active === t ? 'text-brand-600' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          {t === 'login' ? 'Вход' : 'Регистрация'}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────
interface FormProps { onClose: () => void }

function LoginForm({ onClose }: FormProps) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await authApi.login({ email, password });
      setUser(user);
      onClose();
    } catch (err) {
      setError(extractError(err, 'Не удалось войти. Проверьте email и пароль.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h3 className="font-display font-extrabold text-2xl text-ink-900 tracking-tight">
          Добро пожаловать снова
        </h3>
        <p className="text-sm text-ink-500 mt-1">
          Войдите, чтобы продолжить планировать поездку.
        </p>
      </div>

      <Input
        Icon={Mail}
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="your@email.com"
        autoComplete="email"
        required
      />
      <Input
        Icon={Lock}
        type={showPass ? 'text' : 'password'}
        label="Пароль"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        autoComplete="current-password"
        required
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <span className="text-ink-700">Запомнить меня</span>
        </label>
        <Link
          to="/forgot-password"
          onClick={onClose}
          className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
        >
          Забыли пароль?
        </Link>
      </div>

      {error && (
        <div className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <SubmitBtn disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Войти <ArrowRight className="w-4 h-4" /></>}
      </SubmitBtn>

      <SocialAuth label="или войти через" />
    </form>
  );
}

function RegisterForm({ onClose }: FormProps) {
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setError(null);
    setLoading(true);
    try {
      const user = await authApi.register({ name, email, password });
      setUser(user);
      onClose();
    } catch (err) {
      setError(extractError(err, 'Не удалось зарегистрироваться. Попробуйте ещё раз.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h3 className="font-display font-extrabold text-2xl text-ink-900 tracking-tight">
          Создайте аккаунт
        </h3>
        <p className="text-sm text-ink-500 mt-1">
          Получите кэшбэк до 5% уже на первой поездке.
        </p>
      </div>

      <Input Icon={User} type="text" label="Имя"
        value={name} onChange={setName} placeholder="Алексей" autoComplete="given-name" required />

      <Input Icon={Mail} type="email" label="Email"
        value={email} onChange={setEmail} placeholder="your@email.com" autoComplete="email" required />

      <Input Icon={Phone} type="tel" label="Телефон"
        value={phone} onChange={setPhone} placeholder="+7 999 123-45-67" autoComplete="tel" />

      <Input
        Icon={Lock}
        type={showPass ? 'text' : 'password'}
        label="Пароль"
        value={password}
        onChange={setPassword}
        placeholder="Минимум 8 символов"
        autoComplete="new-password"
        required
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <label className="flex items-start gap-2.5 cursor-pointer select-none text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
        />
        <span className="text-ink-700 leading-snug">
          Согласен с{' '}
          <a href="/terms" className="text-brand-600 font-semibold hover:underline">условиями использования</a>{' '}и{' '}
          <a href="/privacy" className="text-brand-600 font-semibold hover:underline">политикой конфиденциальности</a>
        </span>
      </label>

      {error && (
        <div className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <SubmitBtn disabled={!agreed || loading}>
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <>Создать аккаунт <ArrowRight className="w-4 h-4" /></>}
      </SubmitBtn>

      <SocialAuth label="или зарегистрироваться через" />
    </form>
  );
}

// ─────────────────────────────────────────
// INPUT — с иконкой слева и опц-кнопкой справа
// ─────────────────────────────────────────
interface InputProps {
  Icon: typeof Mail;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  rightSlot?: React.ReactNode;
}
function Input({ Icon, type, label, value, onChange, placeholder, required, autoComplete, rightSlot }: InputProps) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[.1em] font-bold text-ink-500 mb-1.5">
        {label}{required && <span className="text-brand-500 ml-0.5">*</span>}
      </div>
      <div className="relative flex items-center bg-white border border-ink-200 rounded-xl transition-all focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(198,40,40,0.12)] hover:border-ink-300">
        <Icon className="absolute left-4 w-4 h-4 text-ink-400 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[15px] font-medium text-ink-900 placeholder:text-ink-400 outline-none rounded-xl"
        />
        {rightSlot && <div className="absolute right-2">{rightSlot}</div>}
      </div>
    </label>
  );
}

// ─────────────────────────────────────────
// SUBMIT BUTTON — premium red gradient
// ─────────────────────────────────────────
function SubmitBtn({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-[0_8px_24px_rgba(198,40,40,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(198,40,40,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────
// SOCIAL AUTH — Google / Yandex / VK / Apple
// ─────────────────────────────────────────
function SocialAuth({ label }: { label: string }) {
  return (
    <>
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-ink-100" />
        <span className="text-[11px] uppercase tracking-[.12em] font-semibold text-ink-400">{label}</span>
        <div className="flex-1 h-px bg-ink-100" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <SocialBtn label="Google">
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        </SocialBtn>
        <SocialBtn label="Yandex">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FC3F1D"><path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10zm11.42 4.97h2.005V7.027h-2.812c-2.829 0-4.316 1.448-4.316 3.585 0 1.707.815 2.71 2.262 3.745l-2.513 3.61h2.166l2.802-4.183-1.013-.677c-1.187-.799-1.762-1.413-1.762-2.612 0-1.058.751-1.778 2.183-1.778h.998v8.253z"/></svg>
        </SocialBtn>
        <SocialBtn label="VK">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0077FF"><path d="M12.785 16.241s.288-.032.435-.193c.136-.148.131-.425.131-.425s-.018-1.305.587-1.499c.596-.191 1.361 1.273 2.173 1.836.612.426 1.077.333 1.077.333l2.169-.031s1.133-.07.596-.964c-.044-.072-.313-.66-1.612-1.871-1.36-1.265-1.178-1.06.46-3.24 1-1.33 1.398-2.14 1.273-2.487-.117-.33-.852-.243-.852-.243l-2.443.016s-.181-.025-.315.056c-.13.078-.213.262-.213.262s-.387.97-.902 1.797c-1.084 1.744-1.518 1.836-1.696 1.722-.412-.267-.31-1.07-.31-1.642 0-1.785.272-2.53-.534-2.726-.267-.066-.464-.108-1.146-.115-.876-.009-1.617.003-2.037.21-.28.137-.495.443-.364.461.162.022.529.1.724.366.252.341.243 1.106.243 1.106s.144 2.116-.336 2.378c-.331.18-.787-.187-1.752-1.85-.494-.85-.868-1.79-.868-1.79s-.072-.176-.2-.27c-.155-.114-.371-.15-.371-.15l-2.32.016s-.349.01-.477.16c-.114.135-.01.412-.01.412s1.815 4.247 3.871 6.388c1.887 1.961 4.029 1.832 4.029 1.832h.969z"/></svg>
        </SocialBtn>
        <SocialBtn label="Apple">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        </SocialBtn>
      </div>
    </>
  );
}

function SocialBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={`Войти через ${label}`}
      title={`Войти через ${label}`}
      className="flex items-center justify-center py-2.5 rounded-xl border border-ink-200 hover:border-ink-300 hover:bg-surface-2 hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      {children}
    </button>
  );
}
