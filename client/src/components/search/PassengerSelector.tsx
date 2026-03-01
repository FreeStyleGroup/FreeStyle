import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: Passengers;
  onChange: (passengers: Passengers) => void;
  className?: string;
}

export function PassengerSelector({ value, onChange, className }: PassengerSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const total = value.adults + value.children + value.infants;

  const update = (field: keyof Passengers, delta: number) => {
    const newVal = { ...value, [field]: Math.max(field === 'adults' ? 1 : 0, value[field] + delta) };
    if (newVal.adults + newVal.children + newVal.infants > 9) return;
    onChange(newVal);
  };

  return (
    <div ref={ref} className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-left text-sm cursor-pointer hover:border-gray-300 transition-colors"
      >
        <span className="text-gray-400 text-xs block">{t('search.passengers')}</span>
        <span className="font-medium">{total}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[220px]">
          {([
            { key: 'adults' as const, label: t('search.adults'), min: 1 },
            { key: 'children' as const, label: t('search.children'), min: 0 },
            { key: 'infants' as const, label: t('search.infants'), min: 0 },
          ]).map(({ key, label, min }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(key, -1)}
                  disabled={value[key] <= min}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  -
                </button>
                <span className="w-4 text-center text-sm font-medium">{value[key]}</span>
                <button
                  type="button"
                  onClick={() => update(key, 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
