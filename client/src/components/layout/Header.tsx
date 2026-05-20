import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Phone, User2, Menu, X, Globe } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { cn } from '@/utils/cn';

/**
 * Header в воздушном стиле — лого слева, info-ссылки справа.
 * Категории убраны из навигации (они теперь как 3D-tiles ниже hero).
 */

const infoLinks = [
  { to: '/blog',        label: 'Блог' },
  { to: '/how-to-pay',  label: 'Как оплатить' },
  { to: '/about',       label: 'О нас' },
  { to: '/contacts',    label: 'Контакты' },
];

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const openAuth = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'z-50 transition-colors',
        transparent
          ? 'absolute top-0 left-0 right-0'
          : 'bg-white border-b border-ink-100 sticky top-0 shadow-sm',
      )}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className={cn(
                'w-11 h-11 rounded-xl grid place-items-center font-display font-extrabold text-lg shadow-md',
                'bg-gradient-to-br from-brand-500 to-brand-700 text-white',
              )}
            >
              FS
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display font-extrabold text-xl tracking-tight text-ink-900">
                FreeStyle
              </div>
              <div className="text-[10px] uppercase tracking-[.18em] font-semibold text-ink-500">
                Travel · Hotels · Tours
              </div>
            </div>
          </Link>

          {/* Info nav + Right side — desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Info links */}
            <nav className="flex items-center gap-1 mr-3">
              {infoLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-ink-700 hover:text-brand-600 hover:bg-brand-50/50',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="w-px h-6 bg-ink-100" />

            {/* Phone */}
            <a
              href="tel:+74951234567"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-ink-900 hover:text-brand-600 hover:bg-brand-50/50"
            >
              <Phone className="w-4 h-4 text-brand-600" />
              <span className="tabular-nums">+7 495 123-45-67</span>
            </a>

            {/* Lang */}
            <button
              type="button"
              className="p-2 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-surface-2 transition-colors"
              aria-label="Сменить язык"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Login */}
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="flex items-center gap-2 px-4 py-2 ml-1 text-sm font-bold rounded-xl cursor-pointer transition-all bg-gradient-to-br from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-md hover:shadow-lg"
            >
              <User2 className="w-4 h-4" />
              Войти
            </button>
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="p-2 rounded-lg text-ink-700 hover:bg-surface-2"
              aria-label="Войти"
            >
              <User2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-700 hover:bg-surface-2"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-ink-100">
            <a
              href="tel:+74951234567"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold mb-2 text-brand-700"
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums">+7 495 123-45-67</span>
            </a>

            <div className="flex flex-col gap-1">
              {infoLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2.5 rounded-lg text-sm font-semibold',
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-700 hover:bg-surface-2',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialTab={authModalTab} />
    </header>
  );
}
