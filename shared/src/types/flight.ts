export interface AirportRef {
  code: string;
  cityCode: string;
  name: string;
}

export interface AirlineRef {
  code: string;
  name: string;
  logoUrl: string;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
}

export interface FlightOffer {
  id: string;
  origin: AirportRef;
  destination: AirportRef;
  price: MoneyAmount;
  airline: AirlineRef;
  flightNumber: string;
  departureAt: string;
  returnAt: string | null;
  transfers: number;
  durationMinutes: number;
  durationOutbound: number;
  durationReturn: number | null;
  affiliateLink: string;
  isDirectFlight: boolean;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureAt?: string;
  returnAt?: string;
  direct?: boolean;
  currency?: string;
  limit?: number;
  oneWay?: boolean;
}

export interface PriceCalendarEntry {
  date: string;
  price: number;
  currency: string;
  transfers: number;
  airline: string;
  flightNumber: string;
  departureAt: string;
  returnAt: string | null;
}

export interface PopularDirection {
  destination: AirportRef;
  price: MoneyAmount;
  airline: AirlineRef;
  departureAt: string;
  returnAt: string | null;
  transfers: number;
}
