import { Link } from 'react-router-dom';
import type { Destination } from '@freestyle/shared';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg">{destination.name}</h3>
          <p className="text-white/80 text-sm">{destination.bestSeason}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
          <span>{destination.visaInfo}</span>
        </div>
      </div>
    </Link>
  );
}
