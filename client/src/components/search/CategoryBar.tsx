import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlightSearchForm } from './FlightSearchForm';
import { HotelSearchForm } from './HotelSearchForm';
import { cn } from '@/utils/cn';

type CategoryKey = 'flights' | 'hotels' | 'tours' | 'carRental' | 'trains' | 'buses' | 'allTransport' | 'excursions' | 'insurance';

interface Category {
  key: CategoryKey;
  route: string;
  hasForm: boolean;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    key: 'flights',
    route: '/flights',
    hasForm: true,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    key: 'hotels',
    route: '/hotels',
    hasForm: true,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4" />
      </svg>
    ),
  },
  {
    key: 'tours',
    route: '/tours',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
      </svg>
    ),
  },
  {
    key: 'carRental',
    route: '/car-rental',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17h14M5 17a2 2 0 01-2-2v-3a1 1 0 011-1h1l2-4h10l2 4h1a1 1 0 011 1v3a2 2 0 01-2 2M5 17v2m14-2v2M7.5 14h.01M16.5 14h.01" />
      </svg>
    ),
  },
  {
    key: 'trains',
    route: '/trains',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l2-2m4 2l2-2M7 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm0 8h10M9 15h.01M15 15h.01" />
      </svg>
    ),
  },
  {
    key: 'buses',
    route: '/buses',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 18v2m14-2v2M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 7h14M8 15h.01M16 15h.01" />
      </svg>
    ),
  },
  {
    key: 'allTransport',
    route: '/destinations',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    key: 'excursions',
    route: '/excursions',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21V9l4-4h10l4 4v12M3 21h18M8 21v-6h8v6M12 3v2M9 5h6" />
      </svg>
    ),
  },
  {
    key: 'insurance',
    route: '/insurance',
    hasForm: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export function CategoryBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>('flights');

  const handleCategoryClick = (cat: Category) => {
    if (cat.hasForm) {
      setActiveCategory(cat.key);
    } else {
      navigate(cat.route);
    }
  };

  return (
    <div>
      {/* Icon Row */}
      <div className="flex gap-3 md:gap-5 overflow-x-auto scrollbar-hide pb-2 md:justify-center">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
          >
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all',
                activeCategory === cat.key
                  ? 'bg-white text-primary-700 shadow-md'
                  : 'bg-white/20 text-white group-hover:bg-white/40',
              )}
            >
              {cat.icon}
            </div>
            <span
              className={cn(
                'text-xs font-medium whitespace-nowrap transition-colors',
                activeCategory === cat.key ? 'text-white' : 'text-white/70 group-hover:text-white',
              )}
            >
              {t(`categories.${cat.key}`)}
            </span>
          </button>
        ))}
      </div>

      {/* Search Form */}
      {activeCategory && (
        <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
          {activeCategory === 'flights' && <FlightSearchForm />}
          {activeCategory === 'hotels' && <HotelSearchForm />}
        </div>
      )}
    </div>
  );
}
