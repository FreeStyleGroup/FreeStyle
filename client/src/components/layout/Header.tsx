import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthModal } from '@/components/auth/AuthModal';
import { cn } from '@/utils/cn';

const navLinks = [
  { to: '/flights', key: 'flights' },
  { to: '/hotels', key: 'hotels' },
  { to: '/car-rental', key: 'carRental' },
  { to: '/tours', key: 'tours' },
  { to: '/insurance', key: 'insurance' },
  { to: '/destinations', key: 'destinations' },
] as const;

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent }: HeaderProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const openAuth = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      'z-50',
      transparent
        ? 'absolute top-0 left-0 right-0'
        : 'bg-white shadow-sm sticky top-0',
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              transparent ? 'bg-white/20' : 'bg-primary-600',
            )}>
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className={cn(
              'text-xl font-bold',
              transparent ? 'text-white' : 'text-primary-700',
            )}>FreeStyle</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    transparent
                      ? isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Support */}
            <Link
              to="#"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('header.support')}
            </Link>

            {/* Auth Button */}
            <button
              type="button"
              onClick={() => openAuth('login')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer',
                transparent
                  ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  : 'bg-accent-500 text-white hover:bg-accent-600',
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('auth.loginRegister')}
            </button>
          </div>

          {/* Mobile: user + hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              className={cn(
                'p-2 cursor-pointer',
                transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900',
              )}
              onClick={() => openAuth('login')}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              type="button"
              className={cn(
                'p-2 cursor-pointer',
                transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900',
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className={cn(
            'lg:hidden pb-4 pt-2',
            transparent
              ? 'bg-white/10 backdrop-blur-xl rounded-2xl mt-1 px-2 border border-white/10'
              : 'border-t border-gray-100',
          )}>
            {navLinks.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    transparent
                      ? isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10'
                      : isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50',
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}

            <div className={cn(
              'mt-2 pt-2',
              transparent ? 'border-t border-white/10' : 'border-t border-gray-100',
            )}>
              <a
                href="#"
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg',
                  transparent ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('header.support')}
              </a>
              <button
                type="button"
                onClick={() => openAuth('login')}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg cursor-pointer',
                  transparent ? 'text-white hover:bg-white/10' : 'text-accent-600 hover:bg-gray-50',
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('auth.loginRegister')}
              </button>
            </div>
          </nav>
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </header>
  );
}
