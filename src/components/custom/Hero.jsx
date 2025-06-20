// src/components/custom/Hero.jsx

import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import Footer from '~/view-trip/components/Footer';

export default function Hero() {
  return (
    <>
      <section className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            <span className="text-yellow-300">Embarquez</span> vers l'inconnu
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 mb-8">
            Votre planificateur de voyage propulsé à l'IA vous guide pas à pas.
          </p>
          <Link to="/create-trip">
            <Button className="px-8 py-4 text-lg font-medium">
              Démarrer l'aventure
            </Button>
          </Link>
        </div>
      </section>

      {/* ← Ici on place le footer sous la section Hero */}
      <Footer />
    </>
  );
}
