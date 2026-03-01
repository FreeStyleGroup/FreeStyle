import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlightSearchForm } from './FlightSearchForm';
import { HotelSearchForm } from './HotelSearchForm';
import { cn } from '@/utils/cn';

const tabs = [
  { key: 'flights', icon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z' },
  { key: 'hotels', icon: 'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z' },
] as const;

export function SearchTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {tabs.map(({ key }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key as 'flights' | 'hotels')}
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
              activeTab === key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'bg-white/30 text-white hover:bg-white/50',
            )}
          >
            {t(`nav.${key}`)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {activeTab === 'flights' ? <FlightSearchForm /> : <HotelSearchForm />}
      </div>
    </div>
  );
}
