import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import SparklesCore from '~/components/fx/SparklesCore';
import BackgroundBeams from '~/components/fx/BackgroundBeams';

export default function Hero() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Bandeau principal */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="max-w-4xl w-full text-center px-4 py-10 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Explorez l’inconnu.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Laissez l’intelligence artificielle planifier votre prochaine aventure.
          </p>

          <div className="mt-8">
            <Link to="/create-trip">
              <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700">
                Créer un voyage
              </Button>
            </Link>
          </div>
        </div>

        {/* Particules */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={80}
          particleColor="#FFFFFF"
          className="absolute inset-0 w-full h-full z-0"
        />
      </section>

      {/* Arrière-plan animé */}
      <div className="relative z-0 h-0">
        <BackgroundBeams />
      </div>
    </div>
  );
}
