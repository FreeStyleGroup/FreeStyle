export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export interface HotelAffiliateResult {
  city: string;
  checkIn: string;
  checkOut: string;
  affiliateLink: string;
  provider: string;
}

export interface HotelDestination {
  city: string;
  country: string;
  imageUrl: string;
  description: string;
  avgPrice: number;
  currency: string;
}
