import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileTabBar } from '@/components/layout/mobile-tab-bar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
