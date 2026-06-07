import { Link } from 'react-router-dom';
import {
  Plane, Sparkles, ShieldCheck, Wallet, Gift, Globe2, Heart, Users, ArrowRight,
} from 'lucide-react';

/**
 * AboutPage — «О проекте». Премиум-полированная статичная страница.
 * Миссия, ценности, цифры, команда, ссылка на контакты.
 */
export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Sparkles className="w-3 h-3 text-amber-500" />
            FreeStyle · с 2024
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Путешествие — это не услуга.<br />
            Это <em className="not-italic text-amber-500">образ жизни.</em>
          </h1>
          <p className="text-white/85 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
            FreeStyle — российский travel-сервис нового поколения. Авиабилеты, отели, туры,
            визы и страховки — в одном окне, с честной ценой, кэшбэком и личным AI-консьержем Феликсом.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
              Наша миссия
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
              Сделать путешествия <br /><em className="not-italic text-brand-600">простыми, выгодными и красивыми</em>
            </h2>
          </div>
          <div className="text-ink-700 text-[15.5px] leading-relaxed space-y-4">
            <p>
              Мы собрали лучший на российском рынке travel-стек — авиабилеты, отели, поезда, автобусы, туры,
              экскурсии и страховки — в одном интерфейсе. Один аккаунт, одна корзина, один профиль путешественника.
            </p>
            <p>
              Бонусом — Travel Wallet с кэшбэком до 5%, бонусные мили, AI-консьерж Феликс, который помнит ваши
              предпочтения и подсказывает выгодные направления.
            </p>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Stat value="220+"      label="стран и территорий"        Icon={Globe2} />
            <Stat value="900 000+"  label="отелей в базе"             Icon={Plane} />
            <Stat value="5%"        label="кэшбэк на все бронирования" Icon={Wallet} />
            <Stat value="24/7"      label="AI-консьерж Феликс"         Icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
            Ценности
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
            Во что мы верим
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Value Icon={ShieldCheck} title="Честная цена" text="Никаких скрытых комиссий. Цена в поиске — финальная." />
          <Value Icon={Heart}       title="Личный подход" text="AI Феликс учится на ваших поездках и предлагает то, что нравится." />
          <Value Icon={Gift}        title="Возвращаем деньги" text="Travel Wallet — мили и кэшбэк копятся автоматически." />
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-surface-1 border-t border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
                Команда
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight mb-6">
                Маленькая, но <em className="not-italic text-brand-600">очень упрямая</em>
              </h2>
              <p className="text-ink-700 text-[15.5px] leading-relaxed mb-4">
                FreeStyle делают люди, которые сами ездят много и устали от плохих интерфейсов. Мы строим travel-сервис,
                которым приятно пользоваться — каждый клик, каждая страница, каждая цена.
              </p>
              <p className="text-ink-700 text-[15.5px] leading-relaxed">
                Если вы тоже верите, что travel может быть лучше — <Link to="/contacts" className="text-brand-600 font-bold hover:text-brand-700">напишите нам</Link>.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center">
              <Users className="w-24 h-24 text-white/40" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-[13.5px] leading-relaxed">
                <div className="font-display font-extrabold text-2xl mb-1">Москва · Тбилиси · Дубай</div>
                <div className="text-white/70">12 человек в трёх городах · с 2024 года</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight mb-4">
          Готовы спланировать поездку?
        </h2>
        <p className="text-ink-500 text-lg mb-8 max-w-xl mx-auto">
          Начните прямо сейчас — поиск авиабилетов и отелей у нас уже самый быстрый в Рунете.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
            Начать поиск <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contacts" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-ink-200 text-ink-900 font-bold hover:border-ink-300 hover:bg-surface-2 transition-all">
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, Icon }: { value: string; label: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="text-center">
      <div className="inline-flex w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 tabular-nums tracking-tight">{value}</div>
      <div className="text-[13px] text-ink-500 mt-1">{label}</div>
    </div>
  );
}

function Value({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-7 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-2">{title}</div>
      <p className="text-[14px] text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}
