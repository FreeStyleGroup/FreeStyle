import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Plane, BedDouble, Map, Car, Train, Bus,
  Mountain, ShieldCheck, Phone, User2, Menu, X, Globe,
} from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { cn } from '@/utils/cn';

/**
 * Header в стиле Travelask + China travel-v2.
 * 8 категорий горизонтальной навигации, иконки lucide.
 * На главной — transparent overlay поверх hero.
 */

const navLinks = [
  { to: '/flights',    label: 'Авиа',      Icon: Plane },
  { to: '/hotels',     label: 'Отели',     Icon: BedDouble },
  { to: '/tours',      label: 'Туры',      Icon: Map },
  { to: '/car-rental', label: 'Авто',      Icon: Car },
  { to: '/trains',     label: 'Ж/Д',       Icon: Train },
  { to: '/buses',      label: 'Автобусы',  Icon: Bus },
  { to: '/excursions', label: 'Экскурсии', Icon: Mountain },
  { to: '/insurance',  label: 'Страховка', Icon: ShieldCheck },
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
        transparent ? 'absolute top-0 left-0 right-0' : 'bg-white border-b border-ink-100 sticky top-0 shadow-sm',
      )}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* ─── Top row: logo + phone + auth ─── */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className={cn(
                'w-10 h-10 rounded-xl grid place-items-center font-display font-extrabold text-lg shadow-md',
                transparent
                  ? 'bg-white/15 text-white backdrop-blur-lg border border-white/25'
                  : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white',
              )}
            >
              FS
            </div>
            <div className="hidden sm:block leading-tight">
              <div
                className={cn(
                  'font-display font-extrabold text-xl tracking-tight',
                  transparent ? 'text-white' : 'text-brand-700',
                )}
              >
                FreeStyle
              </div>
              <div
                className={cn(
                  'text-[10px] uppercase tracking-[.18em] font-semibold',
                  transparent ? 'text-white/65' : 'text-ink-500',
                )}
              >
                Travel · Hotels · Tours
              </div>
            </div>
          </Link>

          {/* Right side — phone + auth + lang */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="tel:+74951234567"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
                transparent
                  ? 'text-white/90 hover:bg-white/10'
                  : 'text-ink-700 hover:text-brand-600 hover:bg-brand-50',
              )}
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums">+7 495 123-45-67</span>
            </a>
            <button
              type="button"
              className={cn(
                'p-2 rounded-lg transition-colors',
                transparent
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-ink-500 hover:text-ink-700 hover:bg-surface-2',
              )}
              aria-label="Сменить язык"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => openAuth('login')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all',
                transparent
                  ? 'bg-white/15 text-white border border-white/25 backdrop-blur-lg hover:bg-white/25'
                  : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-md hover:shadow-lg',
              )}
            >
              <User2 className="w-4 h-4" />
              Войти
            </button>
          </div>

          {/* Mobile burger */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className={cn(
                'p-2 rounded-lg cursor-pointer',
                transparent ? 'text-white/90 hover:bg-white/10' : 'text-ink-700 hover:bg-surface-2',
              )}
              aria-label="Войти"
            >
              <User2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'p-2 rounded-lg cursor-pointer',
                transparent ? 'text-white/90 hover:bg-white/10' : 'text-ink-700 hover:bg-surface-2',
              )}
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ─── Bottom row: horizontal category nav (desktop only) ─── */}
        <nav
          className={cn(
            'hidden lg:flex items-center gap-1 -mt-1 pb-2 overflow-x-auto scrollbar-hide',
            transparent && 'border-t border-white/10 pt-2',
          )}
        >
          {navLinks.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  transparent
                    ? isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                    : isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-surface-2 hover:text-brand-600',
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav
            className={cn(
              'lg:hidden py-3',
              transparent
                ? 'bg-brand-950/70 backdrop-blur-xl rounded-2xl mb-3 px-2 border border-white/10'
                : 'border-t border-ink-100',
            )}
          >
            <a
              href="tel:+74951234567"
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold mb-1',
                transparent ? 'text-white' : 'text-brand-700',
              )}
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums">+7 495 123-45-67</span>
            </a>

            <div className="grid grid-cols-2 gap-1">
              {navLinks.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      transparent
                        ? isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/85 hover:bg-white/10'
                        : isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-700 hover:bg-surface-2',
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
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
