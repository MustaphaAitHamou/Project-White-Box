// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './custom/Header';
import Footer from '~/view-trip/components/Footer';

export default function Layout() {
  return (
    <>
      <Header />

      {/* Le main est transparent pour laisser voir le gradient */}
      <main className="pt-20 bg-transparent min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
