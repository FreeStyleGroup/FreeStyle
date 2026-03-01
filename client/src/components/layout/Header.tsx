import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const navLinks = [
  { to: '/flights', key: 'flights' },
  { to: '/hotels', key: 'hotels' },
  { to: '/car-rental', key: 'carRental' },
  { to: '/tours', key: 'tours' },
  { to: '/insurance', key: 'insurance' },
  { to: '/destinations', key: 'destinations' },
] as const;

export function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-primary-700">FreeStyle</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navLinks.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50',
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
