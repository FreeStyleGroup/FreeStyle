import { useState, useRef, useEffect } from 'react';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { cn } from '@/utils/cn';
import type { AutocompleteItem } from '@freestyle/shared';

interface AirportAutocompleteProps {
  placeholder: string;
  value: AutocompleteItem | null;
  onChange: (item: AutocompleteItem | null) => void;
  className?: string;
}

export function AirportAutocomplete({ placeholder, value, onChange, className }: AirportAutocompleteProps) {
  const { query, setQuery, suggestions, isLoading, selectItem } = useAutocomplete();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(value.name);
    }
  }, [value, setQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: AutocompleteItem) => {
    selectItem(item);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (!e.target.value) onChange(null);
        }}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
      />

      {value && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
          {value.code}
        </span>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li key={`${item.type}-${item.code}`}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.countryName}
                    {item.type === 'airport' && ` \u2022 ${item.cityName}`}
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400 ml-2">{item.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-sm text-gray-400">
          Поиск...
        </div>
      )}
    </div>
  );
}
