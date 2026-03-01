export function airlineLogoUrl(iataCode: string, width = 100, height = 40): string {
  return `https://pics.avs.io/${width}/${height}/${iataCode}.png`;
}
