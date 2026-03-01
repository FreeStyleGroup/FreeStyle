import { useState, useCallback } from 'react';
import { flightsApi } from '../api/flights.api';
import type { FlightOffer } from '@freestyle/shared';

interface UseFlightSearchReturn {
  results: FlightOffer[];
  isLoading: boolean;
  error: string | null;
  search: (params: {
    origin: string;
    destination: string;
    departureAt?: string;
    returnAt?: string;
    direct?: boolean;
    currency?: string;
  }) => Promise<void>;
  clearResults: () => void;
}

export function useFlightSearch(): UseFlightSearchReturn {
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: {
    origin: string;
    destination: string;
    departureAt?: string;
    returnAt?: string;
    direct?: boolean;
    currency?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await flightsApi.searchPrices(params);
      setResults(data);
    } catch (err) {
      setError('Не удалось загрузить результаты поиска');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clearResults };
}
