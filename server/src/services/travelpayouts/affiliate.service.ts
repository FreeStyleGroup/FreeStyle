import { config } from '../../config/index.js';

const { marker, affiliateBaseUrl } = config.tp;

export const affiliateService = {
  buildFlightLink(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    adults?: number;
  }): string {
    const { origin, destination, departDate, returnDate, adults = 1 } = params;
    const dParts = departDate.split('-');
    const dFormatted = dParts[2] + dParts[1]; // DDMM

    let searchPath = `${origin}${dFormatted}${destination}`;

    if (returnDate) {
      const rParts = returnDate.split('-');
      const rFormatted = rParts[2] + rParts[1];
      searchPath += rFormatted;
    }

    searchPath += `${adults}`;

    const deepUrl = `https://www.aviasales.ru/search/${searchPath}`;
    return `${affiliateBaseUrl}/r?marker=${marker}&u=${encodeURIComponent(deepUrl)}`;
  },

  buildHotelLink(params: {
    city: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
  }): string {
    const { city, checkIn, checkOut, adults = 2 } = params;
    const deepUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}`;
    return `${affiliateBaseUrl}/r?marker=${marker}&u=${encodeURIComponent(deepUrl)}`;
  },

  buildCarRentalLink(params: {
    city: string;
    pickupDate: string;
    dropoffDate: string;
  }): string {
    const { city, pickupDate, dropoffDate } = params;
    const deepUrl = `https://www.economybookings.com/?pick_up=${encodeURIComponent(city)}&pick_up_date=${pickupDate}&drop_off_date=${dropoffDate}`;
    return `${affiliateBaseUrl}/r?marker=${marker}&p=7584&u=${encodeURIComponent(deepUrl)}`;
  },

  buildInsuranceLink(destination?: string): string {
    const deepUrl = destination
      ? `https://www.sravni.ru/strahovka-dlja-vyezda-za-granicu/?destination=${encodeURIComponent(destination)}`
      : 'https://www.sravni.ru/strahovka-dlja-vyezda-za-granicu/';
    return `${affiliateBaseUrl}/r?marker=${marker}&u=${encodeURIComponent(deepUrl)}`;
  },

  buildTourLink(destination?: string): string {
    const deepUrl = destination
      ? `https://level.travel/search?destination=${encodeURIComponent(destination)}`
      : 'https://level.travel/';
    return `${affiliateBaseUrl}/r?marker=${marker}&u=${encodeURIComponent(deepUrl)}`;
  },
};
