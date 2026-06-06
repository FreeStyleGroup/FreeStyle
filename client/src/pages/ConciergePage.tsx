import { Sparkles, MessageCircle, Plane, Hotel, Stamp, Heart, Clock, Globe2, ArrowRight, Check } from 'lucide-react';
import { useAIChat } from '@/components/ai/AIChatContext';

/**
 * ConciergePage — премиум-сервис личного travel-консьержа.
 * Free-уровень — AI Феликс 24/7. Premium-уровень — живой консьерж (когда доступно).
 */
export function ConciergePage() {
  const { open } = useAIChat();

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-[1fr_400px] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
              <Sparkles className="w-3 h-3 text-amber-500" /> AI-консьерж · 24/7 · бесплатно
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Феликс — ваш <em className="not-italic text-amber-500">личный travel-помощник</em>
            </h1>
            <p className="text-white/85 text-lg mt-5 max-w-2xl">
              Спросите про любое направление, визу, бюджет или маршрут. Феликс знает FreeStyle и весь travel-мир: от лоукостеров до люксовых отелей.
            </p>
            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" /> Открыть чат с Феликсом
            </button>
            <p className="text-[12px] text-white/60 mt-4">Кнопка чата всегда справа внизу — Феликс отвечает мгновенно</p>
          </div>
          <div className="relative aspect-square max-w-[300px] mx-auto">
            <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-3xl animate-pulse-amber" />
            <div className="relative w-full h-full rounded-full bg-white/15 backdrop-blur-md border border-white/30 grid place-items-center overflow-hidden">
              <img
                src="/images/cat-concierge.png"
                alt="Феликс"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 px-3 py-2 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
              онлайн · 24/7
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HE CAN DO */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">Что умеет Феликс</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
            Полноценный travel-консультант
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skill Icon={Plane}  title="Поиск перелётов"  text="«Куда полететь на 30 000 ₽ из Москвы летом» — найдёт топ-10 направлений" />
          <Skill Icon={Hotel}  title="Подбор отелей"    text="«Отель в Дубае с пляжем у Burj Khalifa до $200» — подберёт варианты с фото" />
          <Skill Icon={Stamp}  title="Визы и въезд"     text="«Нужна ли виза в Сербию» — расскажет правила и сроки оформления" />
          <Skill Icon={Heart}  title="Маршруты"          text="«Тур по Грузии на 7 дней с детьми» — соберёт day-by-day план" />
          <Skill Icon={Globe2} title="Локальные советы"  text="«Что посмотреть в Бангкоке за 3 дня» — топ мест от местных" />
          <Skill Icon={Clock}  title="Бронирование"      text="«Найди билет Москва-Анталия дешевле 15к» — отслеживает цены" />
        </div>
      </section>

      {/* PLANS */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">Тарифы</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
              Бесплатный AI и Premium-консьерж
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* FREE */}
            <div className="bg-white border border-ink-100 rounded-3xl p-8">
              <div className="text-[11px] uppercase tracking-wider font-bold text-ink-500 mb-2">Free</div>
              <div className="font-display font-extrabold text-3xl text-ink-900 mb-1">Бесплатно</div>
              <p className="text-ink-500 mb-6">Доступ для всех зарегистрированных</p>
              <ul className="space-y-3 mb-6">
                <Bullet>AI-консьерж Феликс 24/7</Bullet>
                <Bullet>Любое количество вопросов</Bullet>
                <Bullet>Поиск перелётов и отелей</Bullet>
                <Bullet>Визовая информация по 220+ странам</Bullet>
                <Bullet>Подбор направлений по бюджету</Bullet>
              </ul>
              <button
                type="button"
                onClick={open}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-brand-600 text-brand-600 font-bold hover:bg-brand-50 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Открыть чат
              </button>
            </div>

            {/* PREMIUM */}
            <div className="relative bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-3xl p-8">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-md bg-amber-500 text-ink-900 text-[10.5px] font-bold uppercase tracking-wider">
                Скоро
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-white/70 mb-2">Premium</div>
              <div className="font-display font-extrabold text-3xl mb-1">от 2 500 ₽<span className="text-base font-medium text-white/70">/мес</span></div>
              <p className="text-white/85 mb-6">Живой консьерж + AI на стероидах</p>
              <ul className="space-y-3 mb-6">
                <Bullet light>Всё из Free плюс:</Bullet>
                <Bullet light>Живой travel-менеджер в Telegram</Bullet>
                <Bullet light>Бронирование от вашего имени</Bullet>
                <Bullet light>Резервные планы при отменах</Bullet>
                <Bullet light>Прайс-tracker — алерт при падении цен</Bullet>
                <Bullet light>Поддержка во время поездки (Help-line 24/7)</Bullet>
              </ul>
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white/15 backdrop-blur text-white font-bold cursor-not-allowed opacity-70"
              >
                Уведомить о запуске
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE QUESTIONS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 text-center mb-3">О чём спросить Феликса</h2>
        <p className="text-ink-500 text-center mb-10">Примеры вопросов, на которые он отвечает быстро и по делу</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {[
            '✈️ Куда полететь в марте на 25 000 ₽',
            '🏝 Лучшие отели в Дубае с пляжем у Burj Khalifa',
            '🛂 Нужна ли виза в Сербию для россиян',
            '🚂 Поезд из Москвы в Питер на завтра вечером',
            '🌴 Что посмотреть на Бали за 5 дней',
            '💸 Где сэкономить на отеле в Стамбуле',
            '🏔 Горнолыжный курорт без визы зимой',
            '🍷 Винный тур в Грузию на выходные',
            '👶 Куда лететь с детьми в феврале',
          ].map((q) => (
            <button
              key={q}
              type="button"
              onClick={open}
              className="text-left px-4 py-3.5 rounded-xl bg-white border border-ink-100 hover:border-brand-300 hover:bg-brand-50/40 transition-all text-[13.5px] text-ink-700"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 mb-5 overflow-hidden border-4 border-white shadow-lg">
          <img src="/images/cat-concierge.png" alt="Феликс" className="w-full h-full object-cover" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Феликс ждёт</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Откройте чат и начните планировать поездку прямо сейчас.</p>
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
        >
          <MessageCircle className="w-4 h-4" /> Открыть чат с Феликсом <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}

function Skill({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-4"><Icon className="w-5 h-5" /></div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}

function Bullet({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className={`flex items-start gap-2 text-[14px] ${light ? 'text-white/90' : 'text-ink-700'}`}>
      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${light ? 'text-amber-300' : 'text-mint-600'}`} />
      <span>{children}</span>
    </li>
  );
}
