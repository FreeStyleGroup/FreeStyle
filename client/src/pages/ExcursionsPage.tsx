import { Navigate } from 'react-router-dom';

/**
 * ExcursionsPage — раздел экскурсий объединён с разделом «Туры»
 * (вкладка «Экскурсии»). Старый маршрут /excursions ведёт туда же.
 */
export function ExcursionsPage() {
  return <Navigate to="/tours?tab=excursion" replace />;
}
