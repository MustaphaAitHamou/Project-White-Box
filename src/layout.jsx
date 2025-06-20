// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header        from './components/custom/Header';
import CookieConsent from './components/ui/CookiesConsent';
import { Toaster }   from 'sonner';
import Footer        from './view-trip/components/Footer';

export default function Layout() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Gradient de fond global */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 -z-10" />

      {/* En-tête, RGPD et toasts */}
      <Header />
      <CookieConsent />
      <Toaster />

      {/* Contenu des routes, transparent pour laisser voir le gradient */}
      <main className="relative flex-grow bg-transparent">
        <Outlet />
      </main>

      {/* Footer transparent */}
      <Footer />
    </div>
  );
}
