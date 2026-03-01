import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { referenceApi } from '../api/reference.api';
import type { AutocompleteItem } from '@freestyle/shared';

interface UseAutocompleteReturn {
  query: string;
  setQuery: (q: string) => void;
  suggestions: AutocompleteItem[];
  isLoading: boolean;
  selectedItem: AutocompleteItem | null;
  selectItem: (item: AutocompleteItem) => void;
  clearSelection: () => void;
}

export function useAutocomplete(): UseAutocompleteReturn {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    referenceApi.autocomplete(debouncedQuery).then((items) => {
      if (!cancelled) {
        setSuggestions(items);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setSuggestions([]);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const selectItem = useCallback((item: AutocompleteItem) => {
    setSelectedItem(item);
    setQuery(item.name);
    setSuggestions([]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    setQuery('');
    setSuggestions([]);
  }, []);

  return { query, setQuery, suggestions, isLoading, selectedItem, selectItem, clearSelection };
}
