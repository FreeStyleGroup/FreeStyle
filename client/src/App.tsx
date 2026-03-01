import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { FlightsPage } from '@/pages/FlightsPage';
import { FlightResultsPage } from '@/pages/FlightResultsPage';
import { HotelsPage } from '@/pages/HotelsPage';
import { CarRentalPage } from '@/pages/CarRentalPage';
import { ToursPage } from '@/pages/ToursPage';
import { InsurancePage } from '@/pages/InsurancePage';
import { DestinationsPage } from '@/pages/DestinationsPage';
import { DestinationDetailPage } from '@/pages/DestinationDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="flights" element={<FlightsPage />} />
        <Route path="flights/results" element={<FlightResultsPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="car-rental" element={<CarRentalPage />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:slug" element={<DestinationDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
