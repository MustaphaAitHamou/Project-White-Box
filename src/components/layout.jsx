 
import React from 'react';
import Header from '~/components/custom/Header';
import Footer from '~/view-trip/components/Footer';
import { Outlet } from 'react-router-dom';

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
