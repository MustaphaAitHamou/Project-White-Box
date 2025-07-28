import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import Footer from '~/view-trip/components/Footer';

export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
            Explorez l’inconnu.
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Laissez l’intelligence artificielle planifier votre prochaine aventure.
          </p>
          <Link to="/create-trip">
            <Button className="mt-8 text-lg shadow-xl">Créer un voyage</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
