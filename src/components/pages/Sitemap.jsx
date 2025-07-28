import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '~/view-trip/components/Footer';

export default function Sitemap() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-slate-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Plan du site 🗺️</h1>

          <ul className="space-y-4 text-lg text-center">
            <li><Link to="/" className="text-violet-400 hover:underline">• Accueil</Link></li>
            <li><Link to="/create-trip" className="text-violet-400 hover:underline">• Créer un voyage</Link></li>
            <li><Link to="/my-trips" className="text-violet-400 hover:underline">• Mes voyages</Link></li>
            <li><Link to="/privacy-policy" className="text-violet-400 hover:underline">• Politique de confidentialité</Link></li>
            <li><Link to="/cookies-settings" className="text-violet-400 hover:underline">• Paramètres des cookies</Link></li>
            <li><Link to="/legal-mentions" className="text-violet-400 hover:underline">• Mentions légales</Link></li>
            <li><Link to="/contact" className="text-violet-400 hover:underline">• Contact</Link></li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
