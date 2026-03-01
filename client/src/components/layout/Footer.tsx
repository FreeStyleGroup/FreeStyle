import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-white">FreeStyle</span>
            </Link>
            <p className="text-sm text-gray-400">
              Находите лучшие цены на авиабилеты, отели и туры по всему миру.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Сервисы</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/flights" className="hover:text-white transition-colors">{t('nav.flights')}</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition-colors">{t('nav.hotels')}</Link></li>
              <li><Link to="/car-rental" className="hover:text-white transition-colors">{t('nav.carRental')}</Link></li>
              <li><Link to="/tours" className="hover:text-white transition-colors">{t('nav.tours')}</Link></li>
              <li><Link to="/insurance" className="hover:text-white transition-colors">{t('nav.insurance')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">{t('nav.destinations')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations/turkey" className="hover:text-white transition-colors">Турция</Link></li>
              <li><Link to="/destinations/thailand" className="hover:text-white transition-colors">Таиланд</Link></li>
              <li><Link to="/destinations/egypt" className="hover:text-white transition-colors">Египет</Link></li>
              <li><Link to="/destinations/uae" className="hover:text-white transition-colors">ОАЭ</Link></li>
              <li><Link to="/destinations/italy" className="hover:text-white transition-colors">Италия</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contacts')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          {year} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
