export interface Airport {
  code: string;
  name: string;
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  timeZone: string;
}

export interface City {
  code: string;
  name: string;
  countryCode: string;
  countryName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  timeZone: string;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
}

export interface Airline {
  code: string;
  name: string;
  isLowCost: boolean;
  logoUrl: string;
}

export interface AutocompleteItem {
  type: 'airport' | 'city';
  code: string;
  name: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}
