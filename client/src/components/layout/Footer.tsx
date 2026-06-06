import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';

/**
 * Footer — премиум, тёмный, на полную ширину.
 * 4 колонки: бренд+контакты / сервисы / направления / информация
 * Иконки соцсетей — Telegram, Email, Phone.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-white/80 mt-auto">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand + contacts */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src="https://freestyle.ru/grey-fs.png"
                alt="ФРИСТАЙЛ.РУ"
                className="h-10 w-auto invert"
                draggable={false}
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-5 max-w-xs">
              Авиабилеты, отели, туры и страховки — в одном окне, с кэшбэком и AI-консьержем.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@freestyle.ru" className="flex items-center gap-2 text-white/80 hover:text-white">
                <Mail className="w-4 h-4" /> hello@freestyle.ru
              </a>
              <a href="https://t.me/freestyle_ru" target="_blank" rel="noopener" className="flex items-center gap-2 text-white/80 hover:text-white">
                <Send className="w-4 h-4" /> @freestyle_ru
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-display font-extrabold text-[11px] uppercase tracking-[.18em] mb-4">Сервисы</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/flights" className="hover:text-white text-white/70 transition-colors">Авиабилеты</Link></li>
              <li><Link to="/hotels" className="hover:text-white text-white/70 transition-colors">Отели</Link></li>
              <li><Link to="/tours" className="hover:text-white text-white/70 transition-colors">Туры</Link></li>
              <li><Link to="/visa" className="hover:text-white text-white/70 transition-colors">Визы</Link></li>
              <li><Link to="/car-rental" className="hover:text-white text-white/70 transition-colors">Авто</Link></li>
              <li><Link to="/insurance" className="hover:text-white text-white/70 transition-colors">Страховки</Link></li>
              <li><Link to="/excursions" className="hover:text-white text-white/70 transition-colors">Экскурсии</Link></li>
              <li><Link to="/trains" className="hover:text-white text-white/70 transition-colors">Поезда</Link></li>
              <li><Link to="/buses" className="hover:text-white text-white/70 transition-colors">Автобусы</Link></li>
              <li className="pt-2 mt-2 border-t border-white/10"><Link to="/concierge" className="hover:text-white text-white/70 transition-colors">AI-консьерж Феликс</Link></li>
              <li><Link to="/business" className="hover:text-white text-white/70 transition-colors">Для бизнеса</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-display font-extrabold text-[11px] uppercase tracking-[.18em] mb-4">Направления</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations" className="hover:text-white text-white/70 transition-colors">Все направления</Link></li>
              <li><Link to="/countries" className="hover:text-white text-white/70 transition-colors">Страны</Link></li>
              <li><Link to="/destinations/turkey" className="hover:text-white text-white/70 transition-colors">Турция</Link></li>
              <li><Link to="/destinations/thailand" className="hover:text-white text-white/70 transition-colors">Таиланд</Link></li>
              <li><Link to="/destinations/uae" className="hover:text-white text-white/70 transition-colors">ОАЭ</Link></li>
              <li><Link to="/destinations/georgia" className="hover:text-white text-white/70 transition-colors">Грузия</Link></li>
              <li><Link to="/destinations/italy" className="hover:text-white text-white/70 transition-colors">Италия</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-display font-extrabold text-[11px] uppercase tracking-[.18em] mb-4">Компания</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white text-white/70 transition-colors">О проекте</Link></li>
              <li><Link to="/blog" className="hover:text-white text-white/70 transition-colors">Блог</Link></li>
              <li><Link to="/contacts" className="hover:text-white text-white/70 transition-colors">Контакты</Link></li>
              <li><Link to="/cabinet" className="hover:text-white text-white/70 transition-colors">Личный кабинет</Link></li>
              <li className="pt-3 mt-3 border-t border-white/10">
                <Link to="/terms" className="hover:text-white text-white/50 text-[12.5px]">Условия использования</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white text-white/50 text-[12.5px]">Политика конфиденциальности</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-white/50">
          <div>© {year} FreeStyle · ООО «Фристайл» · ИНН 7700000000</div>
          <div className="flex items-center gap-4">
            <a href="https://t.me/freestyle_ru" target="_blank" rel="noopener" aria-label="Telegram" className="hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </a>
            <a href="mailto:hello@freestyle.ru" aria-label="Email" className="hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
