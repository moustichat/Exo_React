import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.06),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900 transition-colors duration-200 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(2,6,23,0.55),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <Header />
      <main className="relative flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
