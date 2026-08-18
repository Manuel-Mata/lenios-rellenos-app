import type { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { WhatsAppWidget } from '../components/WhatsAppWidget';
import { AiChatWidget } from '../components/AiChatWidget';
import { PrivacyBanner } from '../components/PrivacyBanner';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-container animate-fade-in">
          {children}
        </main>
      </div>
      <WhatsAppWidget />
      <AiChatWidget />
      <PrivacyBanner />
    </div>
  );
}
