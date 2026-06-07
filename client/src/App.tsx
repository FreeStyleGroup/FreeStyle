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
import { TrainsPage } from '@/pages/TrainsPage';
import { RailDemoPage } from '@/pages/rail/RailDemoPage';
import { RailResultsPage } from '@/pages/rail/RailResultsPage';
import { RailTrainPage } from '@/pages/rail/RailTrainPage';
import { BusesPage } from '@/pages/BusesPage';
import { AllTransportPage } from '@/pages/AllTransportPage';
import { ExcursionsPage } from '@/pages/ExcursionsPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { CountriesPage } from '@/pages/CountriesPage';
import { CountryDetailPage } from '@/pages/CountryDetailPage';
import { VisasPage } from '@/pages/VisasPage';
import { ConciergePage } from '@/pages/ConciergePage';
import { BusinessToursPage } from '@/pages/BusinessToursPage';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { CabinetLayout } from '@/pages/cabinet/CabinetLayout';
import { CabinetDashboardPage } from '@/pages/cabinet/CabinetDashboardPage';
import { MyTripsPage } from '@/pages/cabinet/MyTripsPage';
import { FavoritesPage } from '@/pages/cabinet/FavoritesPage';
import { ProfilePage } from '@/pages/cabinet/ProfilePage';
import { DocumentsPage } from '@/pages/cabinet/DocumentsPage';
import { SettingsPage } from '@/pages/cabinet/SettingsPage';
import { WalletPage } from '@/pages/cabinet/WalletPage';
import { TimelinePage } from '@/pages/cabinet/TimelinePage';
import { RecommendationsPage } from '@/pages/cabinet/RecommendationsPage';
import { ReferralPage } from '@/pages/cabinet/ReferralPage';

import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminPostsPage } from '@/pages/admin/AdminPostsPage';
import { AdminPostEditPage } from '@/pages/admin/AdminPostEditPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminAuditLogPage } from '@/pages/admin/AdminAuditLogPage';
import { AdminFactoryPage } from '@/pages/admin/AdminFactoryPage';

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
        <Route path="trains" element={<TrainsPage />} />
        <Route path="trains/results" element={<RailResultsPage />} />
        <Route path="trains/train" element={<RailTrainPage />} />
        <Route path="trains/demo" element={<RailDemoPage />} />
        <Route path="buses" element={<BusesPage />} />
        <Route path="all-transport" element={<AllTransportPage />} />
        <Route path="excursions" element={<ExcursionsPage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:slug" element={<DestinationDetailPage />} />

        {/* Auth flows */}
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        {/* Публичные страницы */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="countries" element={<CountriesPage />} />
        <Route path="countries/:slug" element={<CountryDetailPage />} />
        <Route path="visa" element={<VisasPage />} />
        <Route path="concierge" element={<ConciergePage />} />
        <Route path="business" element={<BusinessToursPage />} />

        {/* Личный кабинет — все авторизованные */}
        <Route path="cabinet" element={<AuthGuard><CabinetLayout /></AuthGuard>}>
          <Route index element={<CabinetDashboardPage />} />
          <Route path="trips" element={<MyTripsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="referral" element={<ReferralPage />} />
        </Route>

        {/* Админка — только admin / editor (часть пунктов editor-allowed) */}
        <Route
          path="admin"
          element={<AuthGuard><RoleGuard allowed={['admin', 'editor']}><AdminLayout /></RoleGuard></AuthGuard>}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="posts/:id" element={<AdminPostEditPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="factory" element={<AdminFactoryPage />} />
          <Route path="audit" element={<AdminAuditLogPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
