import { apiClient } from './client';
import type { FlightOffer, PriceCalendarEntry, PopularDirection, ApiResponse } from '@freestyle/shared';

export const flightsApi = {
  async searchPrices(params: {
    origin: string;
    destination?: string;
    departureAt?: string;
    returnAt?: string;
    direct?: boolean;
    currency?: string;
    limit?: number;
  }): Promise<FlightOffer[]> {
    const { data } = await apiClient.get<ApiResponse<FlightOffer[]>>('/flights/prices', { params });
    return data.data;
  },

  async getCheap(params: {
    origin: string;
    destination?: string;
    departureAt?: string;
    returnAt?: string;
    currency?: string;
  }): Promise<FlightOffer[]> {
    const { data } = await apiClient.get<ApiResponse<FlightOffer[]>>('/flights/cheap', { params });
    return data.data;
  },

  async getCalendar(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    currency?: string;
  }): Promise<PriceCalendarEntry[]> {
    const { data } = await apiClient.get<ApiResponse<PriceCalendarEntry[]>>('/flights/calendar', { params });
    return data.data;
  },

  async getPopular(origin: string, currency?: string): Promise<PopularDirection[]> {
    const { data } = await apiClient.get<ApiResponse<PopularDirection[]>>('/flights/popular', {
      params: { origin, currency },
    });
    return data.data;
  },
};
