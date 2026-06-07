import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PreviewBanner } from './PreviewBanner';
import { DevModeBanner } from './DevModeBanner';
import { CookieConsent } from './CookieConsent';
import { AIChatProvider } from '@/components/ai/AIChatContext';
import { AIFAB } from '@/components/ai/AIFAB';
import { AIChatModal } from '@/components/ai/AIChatModal';

export function MainLayout() {
  return (
    <AIChatProvider>
      <PreviewBanner />
      <Header />
      <main className="flex-1">
        <DevModeBanner />
        <Outlet />
      </main>
      <Footer />

      {/* AI-консьерж — глобально на каждой странице */}
      <AIFAB />
      <AIChatModal />

      {/* Cookie-согласие (152-ФЗ) */}
      <CookieConsent />
    </AIChatProvider>
  );
}
