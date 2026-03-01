export interface Destination {
  slug: string;
  name: string;
  nameEn: string;
  region: string;
  countryCode: string;
  iataCode: string;
  description: string;
  imageUrl: string;
  visaInfo: string;
  currency: string;
  language: string;
  bestSeason: string;
  avgTemperature: string;
  popularCities: DestinationCity[];
}

export interface DestinationCity {
  name: string;
  nameEn: string;
  iataCode: string;
  description: string;
  imageUrl: string;
}
